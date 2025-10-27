import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose';

describe('BooksService', () => {
  let service: BooksService;

  const mockBookModel = {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new book successfully', async () => {
    const dto = {
      title: 'xyz',
      publisher: 'black box publishers',
      author: 'peter theil',
      publishedDate: '22/02/2012',
      thumbnail: 'asadad.png',
    };
    const mockBook = { _id: '1', ...dto };

    mockBookModel.create.mockResolvedValue(mockBook);

    const result = await service.create(dto);

    expect(mockBookModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      success: true,
      statusCode: 201,
      message: 'Book created successfully',
      data: mockBook,
    });
  });

  it('should update a book successfully', async () => {
    const id = '123';
    const updateData = { title: 'abcd' };
    const updatedBook = { _id: id, ...updateData };

    mockBookModel.findByIdAndUpdate.mockResolvedValue(updatedBook);

    const result = await service.update(id, updateData);

    expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      updateData,
      {
        new: true,
      },
    );
    expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  });
});
