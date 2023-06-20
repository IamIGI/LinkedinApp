import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
  isFileExtensionSafe,
  removeFile,
  saveUserProfileImageToStorage,
} from '../../helpers/image-storage';
import { Observable, map, of, switchMap } from 'rxjs';
import { join } from 'path';
import { User } from '../models/user.interface';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../models/friend-request.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveUserProfileImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be an png or jpg.jpeg' });

    const { id: userId } = req.user;
    const imageFolderPath = join(process.cwd(), `images/users/${userId}`);
    const fullImagePath = join(imageFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, fileName).pipe(
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
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const { id: userId } = req.user;
    return this.userService.findImageNameByUserId(userId).pipe(
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
            root: `./images/users/${userId}`,
          }),
        );
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(@Request() req): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
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
  @Get('friend-request/me/all')
  getUserFriendRequestsHistory(@Request() req): Observable<Number[]> {
    const currentUser = req.user;
    return this.userService.getAllUsersWhoAreInConnectionToAuthenticatedUser(
      currentUser,
    );
  }
}
