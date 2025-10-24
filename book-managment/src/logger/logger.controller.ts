import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { LoggerService } from './logger.service';
import * as path from 'path';
import { type Response } from 'express';

@Controller('api/logs')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  getLogs() {
    return this.loggerService.getLogs();
  }

  @Get('download')
  async downloadLogs(@Res() res: Response) {
    const filePath = await this.loggerService.downloadLogs();
    const fileName = path.basename(filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Failed to download logs');
      }
    });
  }
}
