import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const extractToken = (req: Request) => {
    const authorization = req.headers.authorization || "";

    return authorization.replace('Bearer', '').trim();
}

export default {

    validate(request: Request, response: Response, next: NextFunction) {
        const token = extractToken(request);

        if (!token) {
            return response.status(401).json({ message: 'Token não encontrado.' });
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
            return next();

        } catch (error) {
            if (error instanceof TokenExpiredError) {

                window.location.href = '/login';
                alert('Sessão expirada, faça login novamente');

                return response.status(401).json({ message: 'Token expirado.' });
            }
            return response.status(401).json({ message: 'Token Inválido. Por favor, faça login novamente.' });
        }
    },
};