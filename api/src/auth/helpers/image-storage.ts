import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { Observable, from, switchMap, of } from 'rxjs';
import { User } from '../models/user.interface';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

async function createFolder(userId: number) {
  const imageFolderPath = path.join(process.cwd(), `images/users/${userId}`);

  if (!fs.existsSync(imageFolderPath)) {
    await fs.mkdirSync(imageFolderPath, { recursive: true });
  } else {
    //readdir read files before the new file was saved, so when the deleting operation begin, the new saved file is not the target
    await fs.readdir(imageFolderPath, async (err, files) => {
      if (err) throw err;
      for (const file of files) {
        await fs.unlink(path.join(imageFolderPath, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }
}

export const saveImageToStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const { id: userId } = req.user as User;
      await createFolder(userId);
      cb(null, `./images/users/${userId}`);
    },
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtensionSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtensionAndMimeType: {
        ext: validFileExtension;
        mime: validMimeType;
      }) => {
        if (!fileExtensionAndMimeType) return of(false);

        const isFileTypeLegit = validFileExtensions.includes(
          fileExtensionAndMimeType.ext,
        );
        const isMimeTypeLegit = validMimeTypes.includes(
          fileExtensionAndMimeType.mime,
        );
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return of(isFileLegit);
      },
    ),
  );
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};
