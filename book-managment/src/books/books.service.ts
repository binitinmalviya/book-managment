import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import InsertBookDto, { PushImagesUpdate } from './dto/insert.book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getBooks() {
    try {
      const books = await this.bookModel.find({});
      return {
        success: true,
        statusCode: 200,
        message: 'Books fetched successfully',
        data: books,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async get(id: string) {
    try {
      const book = await this.bookModel.findById(id);
      if (!book) throw new NotFoundException('Book not found');
      return {
        success: true,
        statusCode: 200,
        message: 'Book fetched successfully',
        data: book,
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  async create(insertBookDto: InsertBookDto) {
    try {
      const newBook = await this.bookModel.create(insertBookDto);
      return {
        success: true,
        statusCode: 201,
        message: 'Book created successfully',
        data: newBook,
      };
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedBook = await this.bookModel.findByIdAndDelete(id);
      if (!deletedBook) throw new NotFoundException('Book not found');
      return {
        success: true,
        statusCode: 200,
        message: 'Book deleted successfully',
        data: deletedBook,
      };
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<InsertBookDto>) {
    try {
      console.log(id, updateData);

      const updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        },
      );

      console.log('updateData ..', updateData);

      if (!updatedBook) throw new NotFoundException('Book not found');
      return {
        success: true,
        statusCode: 200,
        message: 'Book updated successfully',
        data: updatedBook,
      };
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  async updateImages(id: string, updateData: PushImagesUpdate) {
    try {
      console.log(id, updateData);

      const updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        },
      );

      console.log('updateData ..', updateData);

      if (!updatedBook) throw new NotFoundException('Book not found');
      return {
        success: true,
        statusCode: 200,
        message: 'Book updated successfully',
        data: updatedBook,
      };
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }
}
