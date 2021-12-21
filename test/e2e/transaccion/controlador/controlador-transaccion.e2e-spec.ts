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
import { TransaccionDto } from 'src/aplicacion/transaccion/consulta/dto/transaccion.dto';
import { CuentaDto } from 'src/aplicacion/cuenta/consulta/dto/cuenta.dto';
import { TRANSACCION_DESTINO, TRANSACCION_ORIGEN } from 'src/infraestructura/utilidades/constantes-comunes';
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
     repositorioCuenta = createStubObj<RepositorioCuenta>(['actualizarSaldo', 'existeNumeroCuenta', 'tieneFondos'], sinonSandbox);
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
 
 
   it('debería fallar al realizar una transaccion de un valor menor a lo requerido', async () => {
     const cuenta: ComandoRealizarTransaccion = {
       valor: -1000,
       cuentaOrigen: 123456,
       cuentaDestino: 678909
     };
     const mensaje = `El valor de la transacción debe ser mayor a cero.`;
 
     const response = await request(app.getHttpServer())
       .post('/transactions').send(cuenta)
       .expect(HttpStatus.BAD_REQUEST);
     expect(response.body.message).toBe(mensaje);
     expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
   });

   it('debería fallar al realizar una transaccion con numero de cuenta origen invalido', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 12345,
      cuentaDestino: 678909
    };
    const mensaje = `El número de la cuenta origen debe tener 6 dígitos.`;

    const response = await request(app.getHttpServer())
      .post('/transactions').send(cuenta)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con numero de cuenta destino invalido', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 123456,
      cuentaDestino: 67890
    };
    const mensaje = `El número de la cuenta destino debe tener 6 dígitos.`;

    const response = await request(app.getHttpServer())
      .post('/transactions').send(cuenta)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con número de cuenta origen igual a la de destino', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 123456,
      cuentaDestino: 123456
    };
    const mensaje = `La cuenta origen y la cuenta destino no deben ser iguales`;

    const response = await request(app.getHttpServer())
      .post('/transactions').send(cuenta)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con número de cuentas inexistentes', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 123456,
      cuentaDestino: 678900
    };

    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(false));
    const mensaje =  `La cuenta origen no existe.` || `La cuenta destino no existe.`;

    const response = await request(app.getHttpServer())
      .post('/transactions').send(cuenta)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al realizar una transaccion con fondos insuficientes', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 123456,
      cuentaDestino: 678900
    };

    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
    repositorioCuenta.tieneFondos.returns(Promise.resolve(false));
    const mensaje =  `No tienes fondos suficientes para hacer esta transacción.`;

    const response = await request(app.getHttpServer())
      .post('/transactions').send(cuenta)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
 
   it('debería realizar una transaccion con una cuenta existente y con fondos suficientes', async () => {
    const cuenta: ComandoRealizarTransaccion = {
      valor: 1000,
      cuentaOrigen: 123456,
      cuentaDestino: 678900
    };

    const origen = new CuentaDto();
        origen.id = 1;
        origen.nombre = 'Cuenta de ahorros';
        origen.numeroCuenta = 123456;
    const destino = new CuentaDto();
        destino.id = 2;
        destino.nombre =  'Cuenta de ahorros';
        destino.numeroCuenta = 678900;

    const transaccionDto: TransaccionDto = {
      id: 1,
      valor: 1000,
      costo: 1000,
      createdAt: '2021/01/02 13:00:00',
      origen,
      destino
    };
    repositorioCuenta.existeNumeroCuenta.returns(Promise.resolve(true));
    repositorioCuenta.tieneFondos.returns(Promise.resolve(true));
    repositorioTransaccion.realizarTransaccion.returns(Promise.resolve(transaccionDto));
    repositorioCuenta.actualizarSaldo.withArgs(TRANSACCION_ORIGEN, transaccionDto.origen.numeroCuenta, transaccionDto.valor, transaccionDto.costo).resolves();
    repositorioCuenta.actualizarSaldo.withArgs(TRANSACCION_DESTINO, transaccionDto.destino.numeroCuenta, transaccionDto.valor, transaccionDto.costo).resolves();

     return await request(app.getHttpServer())
       .post('/transactions').send(cuenta)
       .expect(HttpStatus.CREATED);
   });
 
 });