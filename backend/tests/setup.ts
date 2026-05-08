import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;

// Se ejecuta antes de todos los tests
beforeAll(async () => {
  // Creamos el servidor de MongoDB en memoria
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

// Se ejecuta antes de cada test individualmente
beforeEach(async () => {
  // Limpiamos las colecciones para que un test no afecte al siguiente
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Se ejecuta al final de todos los tests
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});