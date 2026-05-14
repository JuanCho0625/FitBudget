import {
  Response,
  NextFunction,
} from "express";

import {
  AuthRequest,
} from "./auth.middleware";

export const roleMiddleware =
    (roles: string[]) => {
      return (
          req: AuthRequest,
          res: Response,
          next: NextFunction
      ) => {
        if (
            !req.authUser ||
            !roles.includes(
                req.authUser.role
            )
        ) {
          return res
              .status(403)
              .json({
                message:
                    "Acceso denegado",
              });
        }

        next();
      };
    };