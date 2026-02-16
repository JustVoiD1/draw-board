import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET!


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'Unauthorized: Missing authorization header',
            success: false
        })
    }
    const token = authHeader.split('Bearer ')[1] ?? ""
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if(decoded && decoded.userId) {
        req.userId = decoded.userId
        next()

    } else {
        return res.status(403).json({
            messsage: 'Unauthorized: Invalid token',
            success: false
        })
    }
    } catch (err) {
        return res.status(500).json({
            message: 'Unauthorized: Authentication failed',
            success: false
        })
    }

    

}