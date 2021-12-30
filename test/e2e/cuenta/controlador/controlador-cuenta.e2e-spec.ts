import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { ComandoCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.comando';
import { ManejadorCrearCuenta } from 'src/aplicacion/cuenta/comando/crear-cuenta.manejador';
import { RepositorioCuenta } from 'src/dominio/cuenta/puerto/repositorio/repositorio-cuenta';
import { ServicioCrearCuenta } from 'src/dominio/cuenta/servicio/servicio-crear-cuenta';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { CuentaControlador } from 'src/infraestructura/cuenta/controlador/cuenta.controlador';
import { servicioCrearCuentaProveedor } from 'src/infraestructura/cuenta/proveedor/servicio/servicio-crear-cuenta.proveedor';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { createStubObj } from 'test/util/create-object.stub';
import * as request from 'supertest';
/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
 const sinonSandbox = createSandbox();

 describe('Pruebas al controlador de cuentas', () => {
 
   let app: INestApplication;
   let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
   let repositorioCuenta: SinonStubbedInstance<RepositorioCuenta>;
 
   /**
    * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
    **/
   beforeAll(async () => {
     repositorioUsuario = createStubObj<RepositorioUsuario>(['existeUsuario', 'buscar'], sinonSandbox);
     repositorioCuenta = createStubObj<RepositorioCuenta>(['crear'], sinonSandbox);
     const moduleRef = await Test.createTestingModule({
       controllers: [CuentaControlador],
       providers: [
         AppLogger,
         {
           provide: ServicioCrearCuenta,
           inject: [RepositorioCuenta, RepositorioUsuario],
           useFactory: servicioCrearCuentaProveedor,
         },
         { provide: RepositorioCuenta, useValue: repositorioCuenta },
         { provide: RepositorioUsuario, useValue: repositorioUsuario },
         ManejadorCrearCuenta,
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
 
   it('debería fallar al crear una cuenta de un usuario no existente', async () => {
      const cuenta: ComandoCrearCuenta = {
        saldo: 100000,
        usuarioId: 1,
      };
      const mensaje = 'El usuario no existe';
  
     repositorioUsuario.existeUsuario.returns(Promise.resolve(false));
 
     const response = await request(app.getHttpServer())
       .post('/cuentas').send(cuenta)
       .expect(HttpStatus.BAD_REQUEST);
 
     expect(response.body.message).toBe(mensaje);
     expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
   });
 
   it('debería crear una cuenta de un usuario existente', async () => {
    const cuenta: ComandoCrearCuenta = {
        saldo: 100000,
        usuarioId: 1,
      };

     repositorioUsuario.existeUsuario.returns(Promise.resolve(true));
 

     return await request(app.getHttpServer())
       .post('/cuentas').send(cuenta)
       .expect(HttpStatus.CREATED);
   });
   
   it('debería fallar al crear una cuenta con un saldo inicial menor a lo requerido', async () => {
     const cuenta: ComandoCrearCuenta = {
       saldo: 1000,
       usuarioId: 1,
     };
     repositorioUsuario.existeUsuario.returns(Promise.resolve(true));
 
     const mensaje = 'El saldo inicial debe ser no menor a 50000';
 
     const response = await request(app.getHttpServer())
       .post('/cuentas').send(cuenta)
       .expect(HttpStatus.BAD_REQUEST);
     expect(response.body.message).toBe(mensaje);
     expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
   });
 
 
 

 });