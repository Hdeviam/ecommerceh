import { NextFunction, Request, Response } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const url = req.originalUrl; 
    const actualDate = new Date();
    const date = actualDate.toLocaleString();

    // Registra el método, la URL y la fecha
    console.log(`[${date}] ${method} ${url}`);

    // Registra los encabezados de la solicitud
    console.log('Request Headers:', req.headers);

    // Captura el tiempo de inicio
    const start = process.hrtime();

    // Al finalizar la solicitud, calcula el tiempo de respuesta
    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInMs = Math.round((duration[0] * 1e3) + (duration[1] / 1e6));
        console.log(`Response Status: ${res.statusCode}, Duration: ${durationInMs}ms`);
    });

    next(); 
}
