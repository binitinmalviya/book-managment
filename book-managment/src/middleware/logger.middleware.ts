import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const dateTime = new Date(start).toLocaleString();

    console.log(`[${dateTime}]`);
    console.log(`req:`, {
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
    });

    const originalSend = res.send;

    res.send = (body: any): Response => {
      const duration = Date.now() - start;

      console.log(
        `[Response Logger] ${req.method} ${req.url} - Response:`,
        body,
      );

      this.loggerService.createLog({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        response: body,
        dateTime,
        duration,
      });

      originalSend.call(res, body);
      return res;
    };

    if (next) next();
  }
}
