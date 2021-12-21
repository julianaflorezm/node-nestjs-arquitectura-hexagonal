/* eslint-disable @typescript-eslint/camelcase */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { UsuarioControlador } from 'src/infraestructura/usuario/controlador/usuario.controlador';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { servicioRegistrarUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-registrar-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { ServicioBuscarUsuario } from 'src/dominio/usuario/servicio/servicio-buscar-usuario';
import { servicioBuscarUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-buscar-usuario.proveedor';
import { ManejadorBuscarUsuario } from 'src/aplicacion/usuario/consulta/buscar-usuario.manejador';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de usuarios', () => {

  let app: INestApplication;
  let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
  let daoUsuario: SinonStubbedInstance<DaoUsuario>;

  /**
   * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
   **/
  beforeAll(async () => {
    repositorioUsuario = createStubObj<RepositorioUsuario>(['existeNombreUsuario', 'guardar', 'existeUsuario', 'buscarUsuario'], sinonSandbox);
    daoUsuario = createStubObj<DaoUsuario>(['listar'], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [UsuarioControlador],
      providers: [
        AppLogger,
        {
          provide: ServicioRegistrarUsuario,
          inject: [RepositorioUsuario],
          useFactory: servicioRegistrarUsuarioProveedor,
        },
        {
          provide: ServicioBuscarUsuario,
          inject: [RepositorioUsuario],
          useFactory: servicioBuscarUsuarioProveedor,
        },
        { provide: RepositorioUsuario, useValue: repositorioUsuario },
        { provide: DaoUsuario, useValue: daoUsuario },
        ManejadorRegistrarUsuario,
        ManejadorListarUsuario,
        ManejadorBuscarUsuario
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    const logger = await app.resolve(AppLogger);
    logger.customError = sinonSandbox.stub();
    app.useGlobalFilters(new FiltroExcepcionesDeNegocio(logger));
    await app.init();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería listar los usuarios registrados', () => {

    const usuarios: any[] = [{ id: 3, nombre: "Sara", /* eslint-disable-next-line @typescript-eslint/camelcase*/ created_at: "2021-12-20T02:15:49.397Z", /* eslint-disable-next-line @typescript-eslint/camelcase*/ updated_at: "2021-12-20T02:15:49.397Z" }];
    daoUsuario.listar.returns(Promise.resolve(usuarios));
    
    return request(app.getHttpServer())
      .get('/users/all')
      .expect(HttpStatus.OK)
      .expect(usuarios);
  });

  it('debería fallar al registar un usuario clave muy corta', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      clave: '123',
    };
    const mensaje = 'El tamaño mínimo de la clave debe ser 4';

    const response = await request(app.getHttpServer())
      .post('/users').send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al registar un usuario ya existente', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      clave: '1234',
    };
    const mensaje = `El nombre de usuario ${usuario.nombre} ya existe`;
    repositorioUsuario.existeNombreUsuario.returns(Promise.resolve(true));

    const response = await request(app.getHttpServer())
      .post('/users').send(usuario)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  // it('debería registar un usuario no existente', async () => {
  //   const usuario: ComandoRegistrarUsuario = {
  //     nombre: 'Lorem ipsum',
  //     clave: '1234',
  //   };
  //   const usuarioCreado: any = {
  //     id: 1,
  //     nombre: "Lorem ipsum",
  //     created_at: "Mon, 20 Dec 2021 19:09:56 GMT",
  //     updated_at: "Mon, 20 Dec 2021 19:09:56 GMT"
  // }
  //   // const usuarioCreado: any = {}; //revisar
  //   repositorioUsuario.existeNombreUsuario.returns(Promise.resolve(false));

  //   return await request(app.getHttpServer())
  //     .post('/users').send(usuario)
  //     .expect(HttpStatus.CREATED)
  //     .expect(usuarioCreado);
  // });

  it('debería fallar al buscar un usuario no existente', async () => {
    const id = 2;

    const mensaje = `El usuario no existe`;
    repositorioUsuario.existeUsuario.returns(Promise.resolve(false));

    const response = await request(app.getHttpServer())
      .get('/users/' + id).send()
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  // it('debería buscar un usuario existente', async () => {
  //   const id = 2;

  //   repositorioUsuario.existeUsuario.returns(Promise.resolve(true));

  //   const usuario: any = {
  //     id: 2,
  //     nombre: "Lorem ipsum",
  //     created_at: "Mon, 20 Dec 2021 19:09:56 GMT",
  //     updated_at: "Mon, 20 Dec 2021 19:09:56 GMT"
  //   }

  //   return request(app.getHttpServer())
  //     .get('/users/' + id)
  //     .expect(HttpStatus.OK)
  //     .expect(usuario);

  // });
});
