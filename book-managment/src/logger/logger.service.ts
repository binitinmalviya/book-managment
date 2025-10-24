import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schema/logger.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(logData: Partial<Log>) {
    const log = new this.logModel(logData);
    await log.save();
  }

  async getLogs() {
    return this.logModel.find().sort({ createdAt: -1 }).exec();
  }

  async downloadLogs(): Promise<string> {
    const logs = await this.logModel.find().lean();

    const dir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, `logs-${Date.now()}.json`);

    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

    return filePath;
  }
}
