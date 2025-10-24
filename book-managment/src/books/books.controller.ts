import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  MultipleFileUploadInterceptor,
  SingleFileUploadInterceptor,
} from 'src/middleware/upload.interceptor';
import type InsertBookDto from './dto/insert.book.dto';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthGuard)
  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.booksService.get(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(SingleFileUploadInterceptor('thumbnail', './uploads/books'))
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() insertBookDto: InsertBookDto,
  ) {
    let filePath = file ? file.path : '';
    filePath = `http://localhost:3000/${filePath}`;
    return this.booksService.create({ ...insertBookDto, thumbnail: filePath });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(SingleFileUploadInterceptor('thumbnail', './uploads/books'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBookDto: Partial<InsertBookDto>,
  ) {
    let filePath = file ? file.path : undefined;
    filePath = `http://localhost:3000/${filePath}`;
    console.log('Body:', updateBookDto, 'File:', filePath);
    return this.booksService.update(id, {
      ...updateBookDto,
      thumbnail: filePath,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    MultipleFileUploadInterceptor('images', 5, './uploads/books'),
  )
  @Put(':id/images')
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'No files uploaded',
      };
    }

    const filePaths = files.map((file) => `http://localhost:3000/${file.path}`);

    const updatedBook = await this.booksService.updateImages(id, {
      $push: { images: { $each: filePaths } },
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Images uploaded successfully',
      data: updatedBook.data,
    };
  }
}
