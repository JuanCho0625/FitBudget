/**
 * financial.routes.test.ts
 *
 * Suite de integración alineada con los contratos reales de la API.
 *
 * CAMPOS REALES POR RECURSO (según controllers):
 *   Expense    → amount, description, categoryId, date         (vía transactions.controller)
 *   Income     → amount, description, categoryId (requerido), date
 *   Category   → name (requerido), type: 'income'|'expense' (requerido), color
 *   Budget     → monthlyLimit (requerido, no "amount"), month (requerido), year
 *   SavingGoal → name|goalName (requerido), targetAmount (requerido), deadline futura (requerido)
 *   Dashboard  → GET /api/dashboard/summary  → { totalIncomes, totalExpenses, balance }
 */

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { app } from "../../src/app";

// ─── SETUP GLOBAL ─────────────────────────────────────────────────────────────

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// ─── TOKENS ───────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "test_secret_super_seguro";

const USER_A_ID = new mongoose.Types.ObjectId().toString();
const USER_B_ID = new mongoose.Types.ObjectId().toString();

const validToken      = jwt.sign({ id: USER_A_ID }, JWT_SECRET, { expiresIn: "1h" });
const otherUserToken  = jwt.sign({ id: USER_B_ID }, JWT_SECRET, { expiresIn: "1h" });
const expiredToken    = jwt.sign({ id: USER_A_ID }, JWT_SECRET, { expiresIn: "-1s" });

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Primero crea una categoría real y devuelve su _id */
const getRealCategoryId = async (type: "expense" | "income" = "expense") => {
    const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ name: `Cat-${Date.now()}`, type, color: "#123456" });
    return res.body.category?._id ?? res.body._id;
};

const createExpense = async (overrides: Record<string, any> = {}) => {
    const categoryId = overrides.categoryId ?? (await getRealCategoryId("expense"));
    return request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
            amount: 150.0,
            description: "Gasto de prueba",
            categoryId,
            date: new Date().toISOString(),
            ...overrides,
        });
};

const createIncome = async (overrides: Record<string, any> = {}) => {
    const categoryId = overrides.categoryId ?? (await getRealCategoryId("income"));
    return request(app)
        .post("/api/incomes")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
            amount: 5000,
            description: "Ingreso de prueba",
            date: new Date().toISOString(),
            categoryId,
            ...overrides,
        });
};

const createCategory = async (overrides: Record<string, any> = {}) =>
    request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ name: "Categoría test", type: "expense", color: "#FF5733", ...overrides });

// Budget usa "monthlyLimit", NO "amount"
const createBudget = async (overrides: Record<string, any> = {}) =>
    request(app)
        .post("/api/budgets")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ monthlyLimit: 3000, month: 5, year: 2025, ...overrides });

// SavingGoal — deadline debe ser fecha FUTURA
const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // +30 días

const createGoal = async (overrides: Record<string, any> = {}) =>
    request(app)
        .post("/api/saving-goals")
        .set("Authorization", `Bearer ${validToken}`)
        .send({ name: "Vacaciones", targetAmount: 10000, deadline: futureDate, ...overrides });

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe("Financial Routes — Integration Tests", () => {

    // ══════════════════════════════════════════════════════════════════════════
    // SEGURIDAD
    // ══════════════════════════════════════════════════════════════════════════
    describe("Security & Authorization", () => {

        it("debería denegar POST /expenses sin token → 401", async () => {
            const res = await request(app).post("/api/expenses").send({});
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar GET /expenses sin token → 401", async () => {
            const res = await request(app).get("/api/expenses");
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar POST /incomes sin token → 401", async () => {
            const res = await request(app).post("/api/incomes").send({});
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar GET /budgets sin token → 401", async () => {
            const res = await request(app).get("/api/budgets");
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar GET /dashboard/summary sin token → 401", async () => {
            const res = await request(app).get("/api/dashboard/summary");
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar con token completamente inválido → 401", async () => {
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", "Bearer esto_no_es_un_jwt");
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar con token expirado → 401", async () => {
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${expiredToken}`);
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar con header Authorization malformado (sin Bearer) → 401", async () => {
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", validToken);
            expect(res.statusCode).toBe(401);
        });

        it("debería denegar JWT firmado con secret incorrecto → 401", async () => {
            const fakeToken = jwt.sign({ id: USER_A_ID }, "secret_incorrecto", { expiresIn: "1h" });
            const res = await request(app)
                .get("/api/expenses")
                .set("Authorization", `Bearer ${fakeToken}`);
            expect(res.statusCode).toBe(401);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // EXPENSES
    // ══════════════════════════════════════════════════════════════════════════
    describe("Expenses CRUD", () => {

        describe("POST /api/expenses", () => {

            it("debería crear un gasto con datos válidos → 201", async () => {
                const res = await createExpense();
                expect(res.statusCode).toBe(201);
                expect(res.body).toHaveProperty("_id");
                expect(res.body.amount).toBe(150);
            });

            it("debería retornar 400 si falta amount", async () => {
                const catId = await getRealCategoryId();
                const res = await request(app)
                    .post("/api/expenses")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ description: "Sin monto", categoryId: catId });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si falta categoryId", async () => {
                const res = await request(app)
                    .post("/api/expenses")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ amount: 100, description: "Sin categoría" });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si amount es negativo", async () => {
                const res = await createExpense({ amount: -100 });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si amount es texto", async () => {
                const res = await createExpense({ amount: "cien pesos" });
                expect(res.statusCode).toBe(400);
            });
        });

        describe("GET /api/expenses", () => {

            it("debería retornar lista vacía si no hay gastos → 200", async () => {
                const res = await request(app)
                    .get("/api/expenses")
                    .set("Authorization", `Bearer ${validToken}`);
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body).toHaveLength(0);
            });

            it("debería retornar solo los gastos del usuario autenticado", async () => {
                await createExpense({ description: "Gasto A" });

                // Usuario B crea el suyo
                const catId = await getRealCategoryId();
                await request(app)
                    .post("/api/expenses")
                    .set("Authorization", `Bearer ${otherUserToken}`)
                    .send({ amount: 999, description: "Gasto B", categoryId: catId, date: new Date() });

                const res = await request(app)
                    .get("/api/expenses")
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveLength(1);
                expect(res.body[0].description).toBe("Gasto A");
            });
        });

        describe("GET /api/expenses/:id", () => {

            it("debería retornar el gasto por ID → 200", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .get(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
                expect(res.body._id).toBe(id);
            });

            it("debería retornar 404 si el ID no existe", async () => {
                const fakeId = new mongoose.Types.ObjectId().toString();
                const res = await request(app)
                    .get(`/api/expenses/${fakeId}`)
                    .set("Authorization", `Bearer ${validToken}`);
                expect(res.statusCode).toBe(404);
            });

            it("debería retornar 400 si el ID tiene formato inválido", async () => {
                const res = await request(app)
                    .get("/api/expenses/id_invalido")
                    .set("Authorization", `Bearer ${validToken}`);
                expect(res.statusCode).toBe(400);
            });

            it("NO debería devolver gasto de otro usuario → 403 o 404", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .get(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${otherUserToken}`);

                expect([403, 404]).toContain(res.statusCode);
            });
        });

        describe("PUT /api/expenses/:id", () => {

            it("debería actualizar el monto → 200", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .put(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ amount: 300 });

                expect(res.statusCode).toBe(200);
                expect(res.body.amount).toBe(300);
            });

            it("debería retornar 404 con ID inexistente", async () => {
                const fakeId = new mongoose.Types.ObjectId().toString();
                const res = await request(app)
                    .put(`/api/expenses/${fakeId}`)
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ amount: 500 });
                expect(res.statusCode).toBe(404);
            });

            it("NO debería actualizar gasto ajeno → 403 o 404", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .put(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${otherUserToken}`)
                    .send({ amount: 9999 });

                expect([403, 404]).toContain(res.statusCode);
            });
        });

        describe("DELETE /api/expenses/:id", () => {

            it("debería eliminar el gasto propio → 200", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .delete(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);

                // Verificar que ya no existe
                const check = await request(app)
                    .get(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${validToken}`);
                expect(check.statusCode).toBe(404);
            });

            it("debería retornar 404 con ID inexistente", async () => {
                const fakeId = new mongoose.Types.ObjectId().toString();
                const res = await request(app)
                    .delete(`/api/expenses/${fakeId}`)
                    .set("Authorization", `Bearer ${validToken}`);
                expect(res.statusCode).toBe(404);
            });

            it("NO debería eliminar gasto ajeno → 403 o 404", async () => {
                const created = await createExpense();
                const id = created.body._id;

                const res = await request(app)
                    .delete(`/api/expenses/${id}`)
                    .set("Authorization", `Bearer ${otherUserToken}`);

                expect([403, 404]).toContain(res.statusCode);
            });
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // INCOMES — requiere categoryId
    // ══════════════════════════════════════════════════════════════════════════
    describe("Incomes CRUD", () => {

        describe("POST /api/incomes", () => {

            it("debería crear un ingreso con datos válidos → 201", async () => {
                const res = await createIncome();
                expect(res.statusCode).toBe(201);
                expect(res.body).toHaveProperty("income");
                expect(res.body.income).toHaveProperty("_id");
            });

            it("debería retornar 400 si falta amount", async () => {
                const catId = await getRealCategoryId("income");
                const res = await request(app)
                    .post("/api/incomes")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ description: "Sin monto", categoryId: catId });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si falta categoryId", async () => {
                const res = await request(app)
                    .post("/api/incomes")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ amount: 1000, description: "Sin categoría" });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si amount es negativo", async () => {
                const res = await createIncome({ amount: -500 });
                expect(res.statusCode).toBe(400);
            });
        });

        describe("GET /api/incomes", () => {

            it("debería retornar solo los ingresos del usuario → 200", async () => {
                await createIncome({ description: "Ingreso A" });

                // Usuario B crea su ingreso
                const catId = await getRealCategoryId("income");
                await request(app)
                    .post("/api/incomes")
                    .set("Authorization", `Bearer ${otherUserToken}`)
                    .send({ amount: 9999, description: "Ingreso B", categoryId: catId, date: new Date() });

                const res = await request(app)
                    .get("/api/incomes")
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                res.body.forEach((income: any) => {
                    expect(income.description).not.toBe("Ingreso B");
                });
            });
        });

        describe("DELETE /api/incomes/:id", () => {

            it("debería eliminar ingreso propio → 200", async () => {
                const created = await createIncome();
                const id = created.body.income._id;

                const res = await request(app)
                    .delete(`/api/incomes/${id}`)
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
            });

            it("NO debería eliminar ingreso ajeno → 403 o 404", async () => {
                const created = await createIncome();
                const id = created.body.income._id;

                const res = await request(app)
                    .delete(`/api/incomes/${id}`)
                    .set("Authorization", `Bearer ${otherUserToken}`);

                expect([403, 404]).toContain(res.statusCode);
            });
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // CATEGORIES — requiere "type": "income" | "expense"
    // ══════════════════════════════════════════════════════════════════════════
    describe("Categories CRUD", () => {

        describe("POST /api/categories", () => {

            it("debería crear una categoría con name y type → 201", async () => {
                const res = await createCategory();
                expect(res.statusCode).toBe(201);
                expect(res.body.category ?? res.body).toHaveProperty("_id");
            });

            it("debería retornar 400 si falta name", async () => {
                const res = await request(app)
                    .post("/api/categories")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ type: "expense" });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si falta type", async () => {
                const res = await request(app)
                    .post("/api/categories")
                    .set("Authorization", `Bearer ${validToken}`)
                    .send({ name: "Sin tipo" });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si type es inválido", async () => {
                const res = await createCategory({ type: "otro" });
                expect(res.statusCode).toBe(400);
            });

            it("debería retornar 400 si el nombre ya existe", async () => {
                await createCategory({ name: "Duplicada", type: "expense" });
                const res = await createCategory({ name: "Duplicada", type: "expense" });
                expect(res.statusCode).toBe(400);
            });
        });

        describe("GET /api/categories", () => {

            it("debería retornar lista de categorías → 200", async () => {
                await createCategory({ name: "Comida", type: "expense" });
                await createCategory({ name: "Salario", type: "income" });

                const res = await request(app)
                    .get("/api/categories")
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThanOrEqual(2);
            });
        });

        describe("DELETE /api/categories/:id", () => {

            it("debería eliminar categoría → 200", async () => {
                const created = await createCategory({ name: "AEliminar", type: "expense" });
                // El controller devuelve { message, category } o solo la categoría
                const id = created.body.category?._id ?? created.body._id;

                const res = await request(app)
                    .delete(`/api/categories/${id}`)
                    .set("Authorization", `Bearer ${validToken}`);

                expect(res.statusCode).toBe(200);
            });
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // BUDGETS — campo "monthlyLimit" (no "amount"), month como número
    // ══════════════════════════════════════════════════════════════════════════
    describe("Budgets CRUD", () => {

        it("debería crear un presupuesto con monthlyLimit y month → 201", async () => {
            const res = await createBudget();
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("budget");
            expect(res.body.budget).toHaveProperty("_id");
        });

        it("debería retornar 400 si falta monthlyLimit", async () => {
            const res = await createBudget({ monthlyLimit: undefined });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si falta month", async () => {
            const res = await createBudget({ month: undefined });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si monthlyLimit es 0 o negativo", async () => {
            const res = await createBudget({ monthlyLimit: -100 });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si month está fuera de rango", async () => {
            const res = await createBudget({ month: 13 });
            expect(res.statusCode).toBe(400);
        });

        it("debería listar presupuestos del usuario → 200", async () => {
            await createBudget();

            const res = await request(app)
                .get("/api/budgets")
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it("NO debería ver presupuestos de otro usuario", async () => {
            await createBudget();

            const res = await request(app)
                .get("/api/budgets")
                .set("Authorization", `Bearer ${otherUserToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(0);
        });

        it("debería eliminar presupuesto propio → 200", async () => {
            const created = await createBudget();
            const id = created.body.budget._id;

            const res = await request(app)
                .delete(`/api/budgets/${id}`)
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
        });

        it("debería retornar 400 al crear el mismo mes dos veces", async () => {
            await createBudget({ month: 6, year: 2025 });
            const res = await createBudget({ month: 6, year: 2025 });
            expect(res.statusCode).toBe(400);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // SAVING GOALS — deadline debe ser fecha FUTURA
    // ══════════════════════════════════════════════════════════════════════════
    describe("Saving Goals CRUD", () => {

        it("debería crear una meta de ahorro → 201", async () => {
            const res = await createGoal();
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("goal");
            expect(res.body.goal).toHaveProperty("_id");
        });

        it("debería retornar 400 si falta targetAmount", async () => {
            const res = await createGoal({ targetAmount: undefined });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si targetAmount es negativo", async () => {
            const res = await createGoal({ targetAmount: -1000 });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si falta deadline", async () => {
            const res = await createGoal({ deadline: undefined });
            expect(res.statusCode).toBe(400);
        });

        it("debería retornar 400 si deadline es fecha pasada", async () => {
            const res = await createGoal({ deadline: "2020-01-01" });
            expect(res.statusCode).toBe(400);
        });

        it("debería listar metas del usuario → 200", async () => {
            await createGoal();

            const res = await request(app)
                .get("/api/saving-goals")
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it("debería eliminar meta propia → 200", async () => {
            const created = await createGoal();
            const id = created.body.goal._id;

            const res = await request(app)
                .delete(`/api/saving-goals/${id}`)
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
        });

        it("NO debería eliminar meta ajena → 403 o 404", async () => {
            const created = await createGoal();
            const id = created.body.goal._id;

            const res = await request(app)
                .delete(`/api/saving-goals/${id}`)
                .set("Authorization", `Bearer ${otherUserToken}`);

            expect([403, 404]).toContain(res.statusCode);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // DASHBOARD — ruta real: /api/dashboard/summary
    // ══════════════════════════════════════════════════════════════════════════
    describe("Dashboard", () => {

        it("debería retornar resumen financiero del usuario → 200", async () => {
            await createExpense({ amount: 100 });
            await createExpense({ amount: 200 });
            await createIncome({ amount: 5000 });

            const res = await request(app)
                .get("/api/dashboard/summary")
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("totalIncomes");
            expect(res.body).toHaveProperty("totalExpenses");
            expect(res.body).toHaveProperty("balance");
        });

        it("debería retornar ceros si no hay datos", async () => {
            const res = await request(app)
                .get("/api/dashboard/summary")
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.totalIncomes).toBe(0);
            expect(res.body.totalExpenses).toBe(0);
            expect(res.body.balance).toBe(0);
        });

        it("debería retornar 401 sin token", async () => {
            const res = await request(app).get("/api/dashboard/summary");
            expect(res.statusCode).toBe(401);
        });

        it("NO debería mezclar datos de diferentes usuarios", async () => {
            // Usuario A tiene gastos e ingresos
            await createExpense({ amount: 500 });
            await createIncome({ amount: 8000 });

            // Usuario B consulta su propio dashboard
            const res = await request(app)
                .get("/api/dashboard/summary")
                .set("Authorization", `Bearer ${otherUserToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.totalExpenses).toBe(0);
            expect(res.body.totalIncomes).toBe(0);
        });
    });

    // ══════════════════════════════════════════════════════════════════════════
    // FLUJO E2E
    // ══════════════════════════════════════════════════════════════════════════
    describe("Flujo E2E", () => {

        it("crear categoría → crear gasto con esa categoría → reflejarse en dashboard", async () => {
            // 1. Categoría
            const catRes = await createCategory({ name: "Alimentación", type: "expense" });
            expect(catRes.statusCode).toBe(201);
            const catId = catRes.body.category?._id ?? catRes.body._id;

            // 2. Gasto usando esa categoría
            const expRes = await createExpense({ amount: 350, categoryId: catId, description: "Despensa" });
            expect(expRes.statusCode).toBe(201);

            // 3. Dashboard refleja el gasto
            const dashRes = await request(app)
                .get("/api/dashboard/summary")
                .set("Authorization", `Bearer ${validToken}`);

            expect(dashRes.statusCode).toBe(200);
            expect(dashRes.body.totalExpenses).toBeGreaterThanOrEqual(350);
        });

        it("crear presupuesto → superarlo con gastos → presupuesto sigue existiendo", async () => {
            // 1. Presupuesto de $500
            const budRes = await createBudget({ monthlyLimit: 500, month: 7, year: 2025 });
            expect(budRes.statusCode).toBe(201);

            // 2. Gasto que supera el presupuesto
            await createExpense({ amount: 600 });

            // 3. El presupuesto sigue en la lista (no se elimina automáticamente)
            const res = await request(app)
                .get("/api/budgets")
                .set("Authorization", `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it("meta de ahorro — ciclo completo crear → actualizar → eliminar", async () => {
            // 1. Crear
            const created = await createGoal({ name: "Laptop nueva", targetAmount: 20000 });
            expect(created.statusCode).toBe(201);
            const id = created.body.goal._id;

            // 2. Abonar monto
            const updated = await request(app)
                .put(`/api/saving-goals/${id}`)
                .set("Authorization", `Bearer ${validToken}`)
                .send({ addAmount: 5000 });
            expect(updated.statusCode).toBe(200);
            expect(updated.body.goal.currentAmount).toBe(5000);

            // 3. Eliminar
            const deleted = await request(app)
                .delete(`/api/saving-goals/${id}`)
                .set("Authorization", `Bearer ${validToken}`);
            expect(deleted.statusCode).toBe(200);
        });
    });
});