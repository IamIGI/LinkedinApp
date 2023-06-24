import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
const FileType = require('file-type');
const gm = require('gm').subClass({ imageMagick: '7+' });

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

export function getUserProfileImagePath(userId: number): string {
  return `${storagePath.users}/${userId}/profile`;
}

export function getUserBackgroundImagePath(userId: number): string {
  return `${storagePath.users}/${userId}/background`;
}

function smallImgName(imageName: string): string {
  return `${imageName.split('.')[0]}-small.${imageName.split('.')[1]}`;
}

export async function createSmallImage(
  imageType: 'post' | 'user' | 'background' | 'temporary',
  imageName: string,
  userId: number,
) {
  let imagePath = '';
  switch (imageType) {
    case 'temporary':
      imagePath = path.join(
        process.cwd(),
        `${storagePath.temporary}/users/${userId}`,
      );
      break;
    case 'post':
      imagePath = path.join(process.cwd(), `${storagePath.posts}/${userId}`);
      break;
    case 'user':
      imagePath = path.join(process.cwd(), `${storagePath.users}/${userId}`);
      break;
    case 'background':
      imagePath = path.join(
        process.cwd(),
        `${storagePath.users}/${userId}/background`,
      );
      break;
    default:
      throw new Error('wrong ImageType: ' + imageType);
  }

  const resizedImageName = smallImgName(imageName);

  gm(path.join(imagePath, imageName))
    .resize(20, 20, '!')
    .write(path.join(imagePath, resizedImageName), (err: any) => {
      if (err) throw new Error('Could not resize the image:' + err);
    });
}

export async function deletePostImage(userId: number, imageName: string) {
  const imagePath = path.join(
    process.cwd(),
    `${storagePath.posts}/${userId}/${imageName}`,
  );
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err: any) => {
      if (err) throw err;
    });
  }
}

async function createUserProfileImageFolder(userId: number) {
  const imageFolderPath = path.join(
    process.cwd(),
    getUserProfileImagePath(userId),
  );

  if (!fs.existsSync(imageFolderPath)) {
    await fs.mkdirSync(imageFolderPath, { recursive: true });
  } else {
    //readdir - read files before the new file was saved, so when the deleting operation begin, the new saved file is not the target
    await fs.readdir(imageFolderPath, async (err: Error, files: any) => {
      if (err) throw err;
      for (const file of files) {
        await fs.unlink(path.join(imageFolderPath, file), (err: Error) => {
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
  }
}

export async function copyImageFromTemporaryToUserPost(
  fileName: string,
  userId: number,
) {
  await createPostImageFolder(userId);

  const temporaryPath = path.join(
    process.cwd(),
    `${storagePath.temporary}/users/${userId}`,
  );
  const userPostPath = path.join(
    process.cwd(),
    `${storagePath.posts}/${userId}`,
  );
  if (fs.existsSync(temporaryPath)) {
    const resizedImageName = smallImgName(fileName);
    await fs.copyFile(
      path.join(temporaryPath, resizedImageName),
      path.join(userPostPath, resizedImageName),
      async (err: any) => {
        if (err) throw new Error('Could not copy smallImg');
      },
    );
    await fs.copyFile(
      path.join(temporaryPath, fileName),
      path.join(userPostPath, fileName),
      async (err: any) => {
        if (err) throw err;
        await removeUserImageTemporaryFolder(userId);
      },
    );
  }
}

export async function removeUserImageTemporaryFolder(userId: number) {
  const userFolderPath = path.join(
    process.cwd(),
    `${storagePath.temporary}/users/${userId}`,
  );
  if (fs.existsSync(userFolderPath)) {
    await fs.rmSync(userFolderPath, { recursive: true, force: true });
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

// export const savePostImageToStorage = {
//   storage: diskStorage({
//     destination: async (req, file, cb) => {
//       const { id: userId } = req.user as User;
//       await removeUserImageTemporaryFolder(userId);
//       await createPostImageFolder(userId);
//       cb(null, `${storagePath.posts}/${userId}`);
//     },
//     filename: (req, file, cb) => {
//       const fileExtension: string = path.extname(file.originalname);
//       const fileName: string = uuidv4() + fileExtension;
//       cb(null, fileName);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes: validMimeType[] = validMimeTypes;
//     allowedMimeTypes.includes(file.mimetype as validMimeType)
//       ? cb(null, true)
//       : cb(null, false);
//   },
// };

export const saveUserImageToTemporaryStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const { id: userId } = req.user as User;
      await removeUserImageTemporaryFolder(userId);
      await createUserImageTemporaryFolder(userId);
      cb(null, `${storagePath.temporary}/users/${userId}`);
    },
    filename: async (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      const { id: userId } = req.user as User;
      await createSmallImage('temporary', fileName, userId);
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype as validMimeType)
      ? cb(null, true)
      : cb(null, false);
    console.log('fileIsSaved');
  },
};

export const saveUserProfileImageToStorage = {
  storage: diskStorage({
    destination: async (req, file, cb) => {
      const { id: userId } = req.user as User;
      await createUserProfileImageFolder(userId);
      cb(null, getUserProfileImagePath(userId)); // './' on the beginning of the path if error
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
