import { Request, Response, NextFunction } from "express";
// import jwt, {JwtPayload} from "jsonwebtoken"
import {jwtVerify, JWTPayload} from "jose"
// const JWT_SECRET = process.env.JWT_SECRET!
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'Unauthorized: Missing authorization header',
            success: false
        })
    }
    const token = authHeader.split('Bearer ')[1] ?? ""
    try {
        // const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        const {payload} = await jwtVerify(token, JWT_SECRET)
    if (payload && typeof payload.userId === 'string') {
            req.userId = payload.userId;
            
        return next();
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