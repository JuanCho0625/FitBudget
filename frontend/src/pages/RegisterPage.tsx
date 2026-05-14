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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await registerUser(name, email, password);
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Error al crear la cuenta");
            } else {
                setError("Error inesperado. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">FitBudget</div>
                <h1 className="auth-title">Crea tu cuenta</h1>
                <p className="auth-subtitle">Empieza a controlar tus finanzas hoy</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="form-field">
                        <label className="form-label">Nombre completo</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", justifyContent: "center", padding: "11px" }}
                    >
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="auth-divider">o regístrate con</div>

                <a href={GOOGLE_AUTH_URL} className="btn-google">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Continuar con Google
                </a>

                <p className="auth-footer">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
