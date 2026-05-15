import {
    useEffect,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

function OAuthSuccessPage() {
    const navigate =
        useNavigate();

    const [searchParams] =
        useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/?error=oauth_failed", { replace: true });
        }
    }, []);

    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p style={{ color: "var(--text-2)", fontSize: 15 }}>Autenticando con Google...</p>
        </div>
    );
}

export default OAuthSuccessPage;