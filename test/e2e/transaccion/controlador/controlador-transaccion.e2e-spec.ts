import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { createStubObj } from 'test/util/create-object.stub';
import * as request from 'supertest';
import { RepositorioTransaccion } from 'src/dominio/transaccion/puerto/repositorio/repositorio-transaccion';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { TransaccionControlador } from 'src/infraestructura/transaccion/controlador/transaccion.controlador';
import { ServicioRealizarTransaccion } from 'src/dominio/transaccion/servicio/servicio-realizar-transaccion';
import { servicioRealizarTransaccionProveedor } from 'src/infraestructura/transaccion/proveedor/servicio/servicio-realizar-transaccion.proveedor';
import { ManejadorRealizarTransaccion } from 'src/aplicacion/transaccion/comando/realizar-transaccion.manejador';
import { ComandoRealizarTransaccion } from 'src/aplicacion/transaccion/comando/realizar-transaccion.comando';
import { CuentaCreada } from 'src/dominio/cuenta/modelo/cuenta-creada';
import { UsuarioCreado } from 'src/dominio/usuario/modelo/usuario-creado';
import { TransaccionCreada } from 'src/dominio/transaccion/modelo/transaccion-creada';
/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
 const sinonSandbox = createSandbox();

 describe('Pruebas al controlador de transacciones', () => {
 
   let app: INestApplication;
   let repositorioTransaccion: SinonStubbedInstance<RepositorioTransaccion>;
   let repositorioCuenta: SinonStubbedInstance<RepositorioCuenta>;
 
   /**
    * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
    **/
   beforeAll(async () => {
     repositorioTransaccion = createStubObj<RepositorioTransaccion>(['realizarTransaccion'], sinonSandbox);
     repositorioCuenta = createStubObj<RepositorioCuenta>(['actualizarSaldo', 'existeNumeroCuenta', 'tieneFondos', 'buscar'], sinonSandbox);
     const moduleRef = await Test.createTestingModule({
       controllers: [TransaccionControlador],
       providers: [
         AppLogger,
         {
           provide: ServicioRealizarTransaccion,
           inject: [RepositorioTransaccion, RepositorioCuenta],
           useFactory: servicioRealizarTransaccionProveedor,
         },
         { provide: RepositorioTransaccion, useValue: repositorioTransaccion },
         { provide: RepositorioCuenta, useValue: repositorioCuenta },
         ManejadorRealizarTransaccion,
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

 
  it('debería fallar al realizar una transaccion con número de cuentas inexistentes', async () => {
    const comando: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 12345678,
      cuentaDestino: 12345678
    };

    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(false));
    const mensaje =  `La cuenta origen no existe.` || `La cuenta destino no existe.`;

    const response = await request(app.getHttpServer())
      .post('/transacciones').send(comando)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con un valor igual a cero', async () => {
    const comando: ComandoRealizarTransaccion = {
      valor: 0,
      cuentaOrigen: 12345678,
      cuentaDestino: 12345679
    };

    const usuario = new UsuarioCreado(1, 'camila', 'xxxx', new Date(), new Date());
    const cuentaOrg = new CuentaCreada(1, 'Cuenta de ahorros', 12345678, 10000, usuario, new Date(), new Date());
    const cuentaDes = new CuentaCreada(2, 'Cuenta de ahorros', 12345679, 100000, usuario, new Date(), new Date());
    
    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));

    const mensaje = `El valor de la transacción debe ser mayor a cero.`;

    const response = await request(app.getHttpServer())
      .post('/transacciones').send(comando)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con un valor menor a cero', async () => {
    const comando: ComandoRealizarTransaccion = {
      valor: -1000,
      cuentaOrigen: 12345678,
      cuentaDestino: 12345679
    };

    const usuario = new UsuarioCreado(1, 'camila', 'xxxx', new Date(), new Date());
    const cuentaOrg = new CuentaCreada(1, 'Cuenta de ahorros', 12345678, 10000, usuario, new Date(), new Date());
    const cuentaDes = new CuentaCreada(2, 'Cuenta de ahorros', 12345679, 100000, usuario, new Date(), new Date());
    
    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));

    const mensaje = `El valor de la transacción debe ser mayor a cero.`;

    const response = await request(app.getHttpServer())
      .post('/transacciones').send(comando)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  // it('debería fallar al realizar una transaccion con un valor + costo mayor a sus fondos', async () => {
  //   const comando: ComandoRealizarTransaccion = {
  //     valor: 5000,
  //     cuentaOrigen: 12345612,
  //     cuentaDestino: 12345613
  //   };

  //   const usuario = new UsuarioCreado(1, 'camila', 'xxxx', new Date(), new Date());
  //   const cuentaOrg = new CuentaCreada(1, 'Cuenta de ahorros', 12345612, 1000, usuario, new Date(), new Date());
  //   const cuentaDes = new CuentaCreada(2, 'Cuenta de ahorros', 12345613, 100000, usuario, new Date(), new Date());

  //   repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
  //   repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
  //   repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));

  //   const origen: Transaccion = {
  //     valor: 5000,
  //     esCuentaOrigen: true,
  //     cuenta: cuentaOrg
  //   };
  //   const mensaje = `No tienes fondos suficientes para realizar la transacción.`;
 
  //    const response = await request(app.getHttpServer())
  //      .post('/transacciones').send(comando)
  //      .expect(HttpStatus.BAD_REQUEST);
  //    expect(response.body.message).toBe(mensaje);
  //    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  // });
 
   it('debería realizar una transaccion con una cuenta existente y con fondos suficientes', async () => {
    const comando: ComandoRealizarTransaccion = {
      valor: 5000,
      cuentaOrigen: 12345612,
      cuentaDestino: 12345613
    };

    const usuario = new UsuarioCreado(1, 'camila', 'xxxx', new Date(), new Date());
    const cuentaOrg = new CuentaCreada(1, 'Cuenta de ahorros', 12345612, 100000, usuario, new Date(), new Date());
    const cuentaDes = new CuentaCreada(2, 'Cuenta de ahorros', 12345613, 1000000, usuario, new Date(), new Date());

  const transCreadaOrg = new TransaccionCreada(
    1,
    -5000,
    1000,
    true,
    cuentaOrg,
    new Date(),
    new Date()
  );

  const transCreadaDes = new TransaccionCreada(
      2,
      5000,
      0,
      false,
      cuentaDes,
      new Date(),
      new Date()
    );
    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
    repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));

    repositorioTransaccion.realizarTransaccion.returns(Promise.resolve(transCreadaOrg));
    repositorioTransaccion.realizarTransaccion.returns(Promise.resolve(transCreadaDes));

    repositorioCuenta.actualizarSaldo.withArgs(cuentaOrg).resolves();
    repositorioCuenta.actualizarSaldo.withArgs(cuentaDes).resolves();

     return await request(app.getHttpServer())
       .post('/transacciones').send(comando)
       .expect(HttpStatus.CREATED);
   });
 
 });