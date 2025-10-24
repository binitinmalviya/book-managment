import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  publishedDate: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
