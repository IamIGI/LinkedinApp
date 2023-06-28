import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  getUserImagePath,
  isFileExtensionSafe,
  removeFile,
  saveUserBackgroundImageToStorage,
  saveUserProfileImageToStorage,
} from '../../helpers/image-storage';
import { Observable, map, of, switchMap } from 'rxjs';
import { join } from 'path';
import { User } from '../models/user.interface';
import {
  FriendRequest,
  FriendRequestStatus,
  UserConnectionHistory,
} from '../models/friend-request.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload/profile')
  @UseInterceptors(FileInterceptor('file', saveUserProfileImageToStorage))
  uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be an png, jpg or jpeg' });

    const { id: userId } = req.user;
    const imageFolderPath = join(
      process.cwd(),
      getUserImagePath(userId, 'profile'),
    );
    const fullImagePath = join(imageFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService
            .updateDBUserImageById(userId, fileName, 'profile')
            .pipe(
              map(() => ({
                modifiedFileName: file.filename,
              })),
            );
        }
        removeFile(fullImagePath);
        return of({ error: 'File content does not match extension' });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image/profile')
  findProfileImage(@Request() req, @Res() res): Observable<Object> {
    const { id: userId } = req.user;
    return this.userService.findImageNameByUserId(userId, 'profile').pipe(
      switchMap((imageName: string) => {
        if (!imageName) {
          return of(
            res.sendFile('blank-profile-picture.jpg', {
              root: './images/default',
            }),
          );
        }
        return of(
          res.sendFile(imageName, {
            root: `./images/users/${userId}/profile`,
          }),
        );
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image/profile/image-name')
  findUserProfileImageName(@Request() req): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId, 'profile').pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image/background')
  findBackgroundImage(@Request() req, @Res() res): Observable<Object> {
    const { id: userId } = req.user;
    return this.userService.findImageNameByUserId(userId, 'background').pipe(
      switchMap((imageName: string) => {
        if (!imageName) {
          return of(
            res.sendFile('blank-background-picture.jpg', {
              root: './images/default',
            }),
          );
        }
        return of(
          res.sendFile(imageName, {
            root: `./images/users/${userId}/background`,
          }),
        );
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image/background/image-name')
  findUserBackgroundImageName(
    @Request() req,
  ): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId, 'background').pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(@Param('userId') userStringId: string): Observable<User> {
    const userId = parseInt(userStringId);
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Get('nopost/:userId')
  findUserByIdWithoutPosts(
    @Param('userId') userStringId: string,
  ): Observable<User> {
    const userId = parseInt(userStringId);
    return this.userService.findUserByIdWithoutPosts(userId);
  }

  @UseGuards(JwtGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req, //since we use JWT token, we can get the information from there
  ): Observable<FriendRequest | { error: string }> {
    const receiverId = parseInt(receiverStringId);
    const creator = req.user;
    return this.userService.sendFriendRequest(receiverId, creator);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Observable<FriendRequestStatus> {
    const receiverId = parseInt(receiverStringId);
    const currentUser = req.user;
    if (currentUser.id === receiverId) return null;
    return this.userService.getFriendRequestStatus(receiverId, currentUser);
  }

  @UseGuards(JwtGuard)
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Body() statusResponse: FriendRequestStatus,
    @Request() req,
  ): Observable<FriendRequestStatus | { error: string }> {
    const friendRequestId = parseInt(friendRequestStringId);
    const currentUser = req.user;

    return this.userService.respondToFriendRequest(
      friendRequestId,
      statusResponse.status,
      currentUser,
    );
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/received-request')
  getFriendRequestsFromRecipients(@Request() req): Observable<FriendRequest[]> {
    const currentUser = req.user;
    return this.userService.getFriendRequestsFromRecipients(currentUser);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/connection')
  getUserFriendRequestsHistory(
    @Request() req,
  ): Observable<UserConnectionHistory[]> {
    const currentUser = req.user;
    return this.userService.getAllUsersWhoAreInConnectionToAuthenticatedUser(
      currentUser,
    );
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/statistics')
  getUserFriendRequestsStatistics(@Request() req): Observable<FriendRequest[]> {
    const currentUser = req.user;
    return this.userService.getUsersFriendsStatisticsData(currentUser);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/no-connection')
  getUsersWhoHasNoConnection(
    @Request() req,
    @Query('skip') skip: number = 0,
  ): Observable<User[]> {
    const currentUser = req.user;

    return this.userService.getUsersWhoAreInNoConnectionToAuthenticatedUser(
      Number(skip),
      currentUser,
    );
  }

  @UseGuards(JwtGuard)
  @Post('upload/background')
  @UseInterceptors(FileInterceptor('file', saveUserBackgroundImageToStorage))
  uploadAccountBackgroundImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.filename;
    if (!fileName) return of({ error: 'File must be an png,jpg or jpeg' });

    const { id: userId } = req.user;
    const imageFolderPath = join(
      process.cwd(),
      getUserImagePath(userId, 'background'),
    );
    const fullImagePath = join(imageFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService
            .updateDBUserImageById(userId, fileName, 'background')
            .pipe(
              map(() => ({
                modifiedFileName: file.filename,
              })),
            );
        }
        removeFile(fullImagePath);
        return of({ error: 'File content does not match extension' });
      }),
    );
  }
}
