import request from 'supertest';
import { app } from '../../src/app';

describe('Auth Integration Tests', () => {
  
  it('Debería responder con un 200 en la raíz (Prueba de Salud)', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('Debería fallar si se envía un registro sin datos', async () => {
    const res = await request(app)
      .post('/api/auth/register') // Asegúrate de que esta sea tu ruta real
      .send({});
    
    // Aquí esperamos un error 400 (Bad Request)
    expect(res.statusCode).toBe(400);
  });
});