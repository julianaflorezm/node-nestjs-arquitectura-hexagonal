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
import { ServicioListarTransaccionesPorCuenta } from 'src/dominio/transaccion/servicio/servicio-listar-transacciones-por-cuenta';
import { servicioListarTransaccionesPorCuentaProveedor } from 'src/infraestructura/transaccion/proveedor/servicio/servicio-listar-transacciones-por-cuenta';
import { ManejadorListarTransaccionesPorCuenta } from 'src/aplicacion/transaccion/consulta/listar-transacciones-por-cuenta.manejador';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { Cuenta } from 'src/dominio/cuenta/modelo/cuenta';
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
     repositorioCuenta = createStubObj<RepositorioCuenta>(['actualizarSaldo', 'existeNumeroCuenta', 'buscar'], sinonSandbox);
     const moduleRef = await Test.createTestingModule({
       controllers: [TransaccionControlador],
       providers: [
         AppLogger,
         {
           provide: ServicioRealizarTransaccion,
           inject: [RepositorioTransaccion, RepositorioCuenta],
           useFactory: servicioRealizarTransaccionProveedor,
         },
         {
          provide: ServicioListarTransaccionesPorCuenta,
          inject: [RepositorioTransaccion, RepositorioCuenta],
          useFactory: servicioListarTransaccionesPorCuentaProveedor,
        },
         { provide: RepositorioTransaccion, useValue: repositorioTransaccion },
         { provide: RepositorioCuenta, useValue: repositorioCuenta },
         ManejadorRealizarTransaccion,
         ManejadorListarTransaccionesPorCuenta
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
      cuentaOrigen: '12345678',
      cuentaDestino: '12345670',
      fechaCreacion: new Date('2022-02-14 12:00:00')
    };

    repositorioCuenta.buscar.returns(Promise.resolve(null));
    const mensaje =  `La cuenta origen no existe` || `La cuenta destino no existe`;

    const response = await request(app.getHttpServer())
      .post('/transacciones').send(comando)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con un valor igual a cero', async () => {
    const comando: ComandoRealizarTransaccion = {
      valor: 0,
      cuentaOrigen: '12345678',
      cuentaDestino: '12345670',
      fechaCreacion: new Date('2022-02-14 12:00:00')
    };

    const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '12345678', 10000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345670', 100000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    
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
      cuentaOrigen: '12345678',
      cuentaDestino: '12345670',
      fechaCreacion: new Date('2022-02-14 12:00:00')
    };

    const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '12345678', 10000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345670', 100000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    
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
  //     cuentaOrigen: '12345678',
  //     cuentaDestino: '12345670',
  //     createdAt: new Date('2022-02-14 12:00:00')
  //   };

  //   const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
  //   const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '12345678', 1000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
  //   const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345670', 100000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    
  //   repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
  //   repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));

  //   const transaccion = Transaccion.crearTransaccion(comando.valor, true, cuentaOrg, comando.createdAt);

  //   const mensaje = `No tienes fondos suficientes para realizar la transacción.`;
 
  //    const response = await request(app.getHttpServer())
  //      .post('/transacciones').send(comando)
  //      .expect(HttpStatus.BAD_REQUEST);
  //    expect(response.body.message).toBe(mensaje);
  //    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  // });
 
//    it('debería realizar una transaccion con una cuenta existente y con fondos suficientes', async () => {
//     const comando: ComandoRealizarTransaccion = {
//       valor: 5000,
//       cuentaOrigen: '34BT667T66',
//       cuentaDestino: '12345670',
//       createdAt: new Date('2022-02-14 12:00:00')
//     };

//     const usuario = new Usuario(1, 'camila', 'xxxx', new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
//     const cuentaOrg = new Cuenta(1, 'Cuenta de ahorros', '34BT667T66', 10000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
//     const cuentaDes = new Cuenta(2, 'Cuenta de ahorros', '12345670', 100000, usuario, new Date('2022-02-14 12:00:00'), new Date('2022-02-14 12:00:00'));
    
   

//   const transCreadaOrg = new Transaccion(
//     1,
//     -5000,
//     1000,
//     true,
//     cuentaOrg,
//     new Date('2022-02-14 12:00:00'),
//     new Date('2022-02-14 12:00:00')
//   );

//   const transCreadaDes = new Transaccion(
//       2,
//       5000,
//       0,
//       false,
//       cuentaDes,
//       new Date('2022-02-14 12:00:00'),
//       new Date('2022-02-14 12:00:00')
//     );

//     repositorioCuenta.buscar.returns(Promise.resolve(cuentaOrg));
//     repositorioCuenta.buscar.returns(Promise.resolve(cuentaDes));
//  const origen = Transaccion.crearTransaccion(
//       5000,
//       true,
//       cuentaOrg,
//       new Date('2022-01-01 11:00:00')
//     );

//     const destino = Transaccion.crearTransaccion(
//         5000,
//         false,
//         cuentaDes,
//         new Date('2022-01-01 11:00:00')
//     );
//     repositorioTransaccion.realizarTransaccion.returns(Promise.resolve(transCreadaOrg));
//     repositorioTransaccion.realizarTransaccion.returns(Promise.resolve(transCreadaDes));

//     repositorioCuenta.actualizarSaldo.withArgs(cuentaOrg).resolves();
//     repositorioCuenta.actualizarSaldo.withArgs(cuentaDes).resolves();

//     const response = await request(app.getHttpServer())
//        .post('/transacciones').send(comando)
//        .expect(HttpStatus.BAD_REQUEST);
    
//     expect(response.body.message).toBe('D');
//    });
  
 });
