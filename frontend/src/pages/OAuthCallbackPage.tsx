import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallbackPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard", { replace: true });
        } else {
            console.error("OAuth error:", error);
            navigate("/?error=oauth_failed", { replace: true });
        }
    }, [navigate]);

    return <p style={{ textAlign: "center", marginTop: 80 }}>Autenticando con Google...</p>;
}

export default OAuthCallbackPage;
