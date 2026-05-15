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
                process.env.FRONTEND_URL ??
                "https://fit-budget-coral.vercel.app",
        }
    ),

    (req, res) => {
        const user: any =
            req.user;

        const token =
            jwt.sign(
                {
                    id: user._id,
                    role:
                    user.role,
                },

                process.env
                    .JWT_SECRET!,

                {
                    expiresIn:
                        "1d",
                }
            );

        res.redirect(
            `${process.env.FRONTEND_URL ?? "https://fit-budget-coral.vercel.app"}/oauth-success?token=${token}`
        );
    }
);

export default router;