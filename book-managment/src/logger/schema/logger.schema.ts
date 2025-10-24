import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Object })
  headers: Record<string, any>;

  @Prop({ type: Object })
  body: Record<string, any>;

  @Prop({ type: Object })
  response: Record<string, any>;

  @Prop()
  dateTime: string;

  @Prop()
  duration: number;
}

export const LogSchema = SchemaFactory.createForClass(Log);
