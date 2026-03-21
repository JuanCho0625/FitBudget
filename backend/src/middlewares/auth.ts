import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No autorizado. Token requerido.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      res.status(401).json({ message: 'Usuario no encontrado.' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};