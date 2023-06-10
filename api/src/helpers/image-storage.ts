import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');

import path = require('path');
import { Observable, from, switchMap, of } from 'rxjs';
import { User } from '../auth/models/user.interface';

export type validFileExtension = 'png' | 'jpg' | 'jpeg';
export type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

export const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
export const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const storagePath = {
  temporary: 'images/temporary',
  posts: 'images/userPosts',
  users: 'images/users',
};

export async function deletePostImage(userId: number, imageName: string) {
  const imagePath = path.join(
    process.cwd(),
    `${storagePath.posts}/${userId}/${imageName}`,
  );
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err: any) => {
      if (err) throw err;
    });
    console.log('Image deleted', imageName);
  }
}

async function createUserProfileImageFolder(userId: number) {
  const imageFolderPath = path.join(
    process.cwd(),
    `${storagePath.users}/${userId}`,
  );

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

/** Allow only for one image per post */
export async function createPostImageFolder(userId: number) {
  const postFolderPath = path.join(
    process.cwd(),
    `${storagePath.posts}/${userId}`,
  );

  if (!fs.existsSync(postFolderPath)) {
    await fs.mkdirSync(postFolderPath, { recursive: true });
    console.log(2.1, 'new postImage folder created');
  }
  if (fs.existsSync(postFolderPath))
    console.log(2.2, 'postImage folder exists');
}

export async function copyImageFromTemporaryToUserPost(
  fileName: string,
  userId: number,
) {
  console.log(1, 'CopyImage process start');
  await createPostImageFolder(userId);
  const temporaryPath = path.join(
    process.cwd(),
    `${storagePath.temporary}/users/${userId}/${fileName}`,
  );
  const userPostPath = path.join(
    process.cwd(),
    `${storagePath.posts}/${userId}/${fileName}`,
  );
  console.log(3, 'begin to copy file');
  if (fs.existsSync(temporaryPath)) {
    await fs.copyFile(temporaryPath, userPostPath, async (err) => {
      if (err) throw err;
      await removeUserImageTemporaryFolder(userId);
      console.log('File was copied to destination');
    });
  }
}

export async function removeUserImageTemporaryFolder(userId: number) {
  const imagesFolderPath = path.join(
    process.cwd(),
    `${storagePath.temporary}/users/${userId}`,
  );
  if (fs.existsSync(imagesFolderPath)) {
    await fs.rmSync(imagesFolderPath, { recursive: true, force: true });
  }
}

export async function createUserImageTemporaryFolder(userId: number) {
  const postFolderPath = path.join(
    process.cwd(),
    `${storagePath.temporary}/users/${userId}`,
  );

  if (!fs.existsSync(postFolderPath)) {
    await fs.mkdirSync(postFolderPath, { recursive: true });
  }
}

export const savePostImageToStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const { id: userId } = req.user as User;
      await removeUserImageTemporaryFolder(userId);
      await createPostImageFolder(userId);
      cb(null, `${storagePath.posts}/${userId}`);
    },
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? cb(null, true)
      : cb(null, false);
  },
};

export const saveUserImageToTemporaryStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      console.log(1, 'Destination for temporary');
      console.log(req.user);
      const { id: userId } = req.user as User;
      await removeUserImageTemporaryFolder(userId);
      await createUserImageTemporaryFolder(userId);
      cb(null, `${storagePath.temporary}/users/${userId}`);
    },
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    console.log(allowedMimeTypes.includes(file.mimetype as validMimeType));
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? cb(null, true)
      : cb(null, false);
  },
};

export const saveUserProfileImageToStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const { id: userId } = req.user as User;
      await createUserProfileImageFolder(userId);
      cb(null, `${storagePath.users}/${userId}`); // './' on the beginning of the path if error
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
  if (!fullFilePath) return of(false);
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
