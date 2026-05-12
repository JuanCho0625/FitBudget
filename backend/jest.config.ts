import type { Config } from 'jest';

const config: Config = {
  // 1. Usa ts-jest para procesar archivos TypeScript
  preset: 'ts-jest',

  // 2. Define el entorno de ejecución (Node.js para el backend)
  testEnvironment: 'node',

  // 3. Indica dónde buscar los archivos de prueba
  // Buscará cualquier archivo que termine en .test.ts o .spec.ts dentro de /tests
  testMatch: ['<rootDir>/tests/**/*.test.ts'],

  // 4. Carga el archivo de configuración de la base de datos en memoria antes de los tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // 5. Limpia automáticamente los mocks entre cada test
  clearMocks: true,

  // 6. Reporte detallado en la consola
  verbose: true,

  // 7. Evita que Jest se quede colgado si hay procesos abiertos (como sockets)
  forceExit: true,

  // 8. Define alias si los usas en tu tsconfig (opcional)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;