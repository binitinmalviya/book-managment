import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function SingleFileUploadInterceptor(
  fieldName: string,
  folderPath = './uploads',
) {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: folderPath,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

export function MultipleFileUploadInterceptor(
  fieldName: string,
  maxCount = 10,
  folderPath = './uploads',
) {
  return FilesInterceptor(fieldName, maxCount, {
    storage: diskStorage({
      destination: folderPath,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
          null,
          `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
        );
      },
    }),
  });
}
