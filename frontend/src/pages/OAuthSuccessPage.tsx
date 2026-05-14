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
        const token =
            searchParams.get(
                "token"
            );

        console.log(
            "TOKEN:",
            token
        );

        if (token) {
            localStorage.setItem(
                "token",
                token
            );

            navigate(
                "/dashboard"
            );
        } else {
            navigate(
                "/?error=oauth_failed"
            );
        }
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent:
                    "center",
                alignItems:
                    "center",
                fontSize: "24px",
                fontWeight:
                    "bold",
            }}
        >
            Logging in with
            Google...
        </div>
    );
}

export default OAuthSuccessPage;