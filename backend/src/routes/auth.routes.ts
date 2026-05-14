import { Router } from "express";

import passport from "passport";
import jwt from "jsonwebtoken";

import {
    register,
    login,
} from "../controllers/auth.controller";

const router = Router();

router.post(
    "/register",
    register
);

router.post(
    "/login",
    login
);

router.get(
    "/google",

    passport.authenticate(
        "google",
        {
            scope: [
                "profile",
                "email",
            ],
        }
    )
);

router.get(
    "/google/callback",

    passport.authenticate(
        "google",
        {
            session: false,
            failureRedirect:
                "/login",
        }
    ),

    async (req, res) => {
        try {
            const profile: any =
                req.user;

            const token =
                jwt.sign(
                    {
                        email:
                        profile.emails?.[0]
                            ?.value,
                    },

                    process.env
                        .JWT_SECRET!,

                    {
                        expiresIn:
                            "7d",
                    }
                );

            res.redirect(
                `http://localhost:5173/oauth-success?token=${token}`
            );
        } catch (error) {
            console.error(
                error
            );

            res.status(500).json({
                message:
                    "OAuth error",
            });
        }
    }
);

export default router;