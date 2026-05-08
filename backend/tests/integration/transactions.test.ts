import request from 'supertest';
import { app } from '../../src/app';
import jwt from 'jsonwebtoken';

describe('Financial Routes Integration Tests', () => {
  
  // Generamos un token de prueba para los casos de éxito
  const validToken = jwt.sign(
    { id: '60d0fe4f5311236168a109ca' }, // Un ID de MongoDB ficticio
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  // --- SECCIÓN DE SEGURIDAD ---
  describe('Security & Authorization', () => {
    it('Debería denegar acceso a /expenses si no hay token', async () => {
      const res = await request(app).post('/api/expenses').send({});
      expect(res.statusCode).toBe(401);
    });

    it('Debería denegar acceso a /incomes si no hay token', async () => {
      const res = await request(app).post('/api/incomes').send({});
      expect(res.statusCode).toBe(401);
    });

    it('Debería denegar acceso si el token es inválido', async () => {
      const res = await request(app)
        .get('/api/expenses')
        .set('Authorization', 'Bearer token_que_no_sirve');
      expect(res.statusCode).toBe(401);
    });
  });

  // --- SECCIÓN DE FUNCIONALIDAD ---
  describe('POST /api/expenses', () => {
    it('Debería permitir crear un gasto con token válido', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          amount: 150.00,
          description: 'Cena ITESO',
          categoryId: '60d0fe4f5311236168a109ca', // <--- AGREGAMOS ESTO
          date: new Date()
        });

      // Ahora que enviamos el categoryId, debería responder 201 (Created)
      expect(res.statusCode).toBe(201); 
      expect(res.body).toHaveProperty('_id'); // Verifica que se guardó
    });
  });
   
});