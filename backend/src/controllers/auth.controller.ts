import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

import { User } from "../models/User";

import { sendEmail }
  from "../services/email.service";

const GOOGLE_TOKEN_URL =
    "https://oauth2.googleapis.com/token";

const GOOGLE_USERINFO_URL =
    "https://www.googleapis.com/oauth2/v2/userinfo";

// ======================
// REGISTER
// ======================

export const register =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {
      try {
        const {
          name,
          email,
          password,
        } = req.body;

        if (
            !name ||
            !email ||
            !password
        ) {
          res.status(400).json({
            message:
                "Faltan datos obligatorios",
          });

          return;
        }

        const existingUser =
            await User.findOne({
              email,
            });

        if (existingUser) {
          res.status(400).json({
            message:
                "El email ya está registrado",
          });

          return;
        }

        const user =
            new User({
              name,
              email,
              password,
              role: "USER",
            });

        await user.save();

        await sendEmail(
            email,
            "welcome",
            {
              userName: name,
            }
        );

        res.status(201).json({
          message:
              "Usuario creado correctamente",
        });
      } catch (error: any) {
        if (
            error.code === 11000
        ) {
          res.status(400).json({
            message:
                "El email ya está registrado",
          });

          return;
        }

        console.log(error);

        res.status(500).json({
          message:
              "Error en el servidor",
        });
      }
    };

// ======================
// LOGIN
// ======================

export const login =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {
      try {
        const {
          email,
          password,
        } = req.body;

        if (
            !email ||
            !password
        ) {
          res.status(400).json({
            message:
                "Faltan datos",
          });

          return;
        }

        const user =
            await User.findOne({
              email,
            });

        if (!user) {
          res.status(400).json({
            message:
                "Credenciales inválidas",
          });

          return;
        }

        if (!user.password) {
          res.status(400).json({
            message:
                "Esta cuenta usa Google. Inicia sesión con Google.",
          });

          return;
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
          res.status(400).json({
            message:
                "Credenciales inválidas",
          });

          return;
        }

        const token =
            jwt.sign(
                {
                  id: user._id,
                  role:
                  user.role,
                },
                process.env
                    .JWT_SECRET as string,
                {
                  expiresIn:
                      "1d",
                }
            );

        res.json({
          message:
              "Login exitoso",
          token,
        });
      } catch (error) {
        console.log(error);

        res.status(500).json({
          message:
              "Error en el servidor",
        });
      }
    };

// ======================
// GOOGLE LOGIN
// ======================

export const googleLogin =
    (
        req: Request,
        res: Response
    ): void => {
      const params =
          new URLSearchParams({
            client_id:
                process.env
                    .GOOGLE_CLIENT_ID as string,

            redirect_uri:
                process.env
                    .GOOGLE_REDIRECT_URI as string,

            response_type:
                "code",

            scope:
                "email profile",

            access_type:
                "offline",

            prompt:
                "select_account",
          });

      res.redirect(
          `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
      );
    };

// ======================
// GOOGLE CALLBACK
// ======================

export const googleCallback =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {
      try {
        const { code } =
            req.query;

        if (!code) {
          res.redirect(
              `${process.env.FRONTEND_URL}/?error=oauth_failed`
          );

          return;
        }

        // Exchange code for token

        const tokenResponse =
            await axios.post(
                GOOGLE_TOKEN_URL,
                new URLSearchParams({
                  code:
                      code as string,

                  client_id:
                      process.env
                          .GOOGLE_CLIENT_ID as string,

                  client_secret:
                      process.env
                          .GOOGLE_CLIENT_SECRET as string,

                  redirect_uri:
                      process.env
                          .GOOGLE_REDIRECT_URI as string,

                  grant_type:
                      "authorization_code",
                }),
                {
                  headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                  },
                }
            );

        const {
          access_token,
        } =
            tokenResponse.data;

        // Get Google user

        const googleUser =
            await axios.get(
                GOOGLE_USERINFO_URL,
                {
                  headers: {
                    Authorization:
                        `Bearer ${access_token}`,
                  },
                }
            );

        const {
          id:
              googleId,
          email,
          name,
        } =
            googleUser.data;

        // Find user

        let user =
            await User.findOne({
              googleId,
            });

        // If not found by Google ID,
        // search by email

        if (!user) {
          user =
              await User.findOne(
                  {
                    email,
                  }
              );

          // Existing email user

          if (user) {
            user.googleId =
                googleId;

            await user.save();
          }

          // Create new user

          else {
            user =
                await User.create(
                    {
                      name,
                      email,
                      googleId,
                      role:
                          "USER",
                    }
                );

            await sendEmail(
                email,
                "welcome",
                {
                  userName:
                  name,
                }
            );
          }
        }

        // Generate JWT

        const token =
            jwt.sign(
                {
                  id: user._id,
                  role:
                  user.role,
                },
                process.env
                    .JWT_SECRET as string,
                {
                  expiresIn:
                      "1d",
                }
            );

        // Redirect frontend

        res.redirect(
            `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
        );
      } catch (error) {
        console.error(
            "Google OAuth error:",
            error
        );

        res.redirect(
            `${process.env.FRONTEND_URL}/?error=oauth_failed`
        );
      }
    };
