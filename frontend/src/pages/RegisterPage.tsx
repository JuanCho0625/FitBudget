import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { registerUser, GOOGLE_AUTH_URL } from "../services/authService";

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerUser(name, email, password);
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Error al registrarse");
            } else {
                setError("Error inesperado. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 20px" }}>
            <h1>FitBudget</h1>
            <h2>Crear cuenta</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Nombre</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>Contraseña</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                </div>

                {error && (
                    <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
                )}

                <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
                    {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
            </form>

            <div style={{ textAlign: "center", margin: "16px 0" }}>— o —</div>

            <a
                href={GOOGLE_AUTH_URL}
                style={{
                    display: "block",
                    textAlign: "center",
                    padding: 10,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    textDecoration: "none",
                    color: "#333",
                }}
            >
                Registrarse con Google
            </a>

            <p style={{ textAlign: "center", marginTop: 20 }}>
                ¿Ya tienes cuenta?{" "}
                <Link to="/">Inicia sesión</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
