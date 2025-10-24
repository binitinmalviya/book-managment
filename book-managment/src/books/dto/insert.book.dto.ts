export default interface InsertBookDto {
  title: string;
  publisher: string;
  publishedDate: string;
  author: string;
  thumbnail: string;
}

export interface PushImagesUpdate {
  $push: {
    images: {
      $each: string[];
    };
  };
}
