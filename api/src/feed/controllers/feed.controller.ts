import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post/post.interface';
import { Observable, of, take } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  removeUserImageTemporaryFolder,
  saveUserImageToTemporaryStorage,
} from 'src/helpers/image-storage';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  create(@Body() post: FeedPost, @Request() req): Observable<FeedPost> {
    console.log(5, 'Begin to saving Post');
    console.log(post);
    return this.feedService.createPost(req.user, post);
  }

  @UseGuards(JwtGuard)
  @Get()
  findSelected(
    @Query('take') take: number = 1,
    @Query('skip') skip: number = 1,
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findPosts(take, skip);
  }

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, IsCreatorGuard, RolesGuard)
  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
  ): Observable<UpdateResult> {
    console.log(1, 'Update begin');
    console.log(2, feedPost);
    return this.feedService.updatePost(id, feedPost);
  }

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', saveUserImageToTemporaryStorage))
  @Post('temporary/image')
  saveImagePostTemporary(
    @UploadedFile() file: Express.Multer.File,
  ): Observable<{ newFilename?: string; error?: string }> {
    console.log(file.filename);
    return of({ newFilename: file.filename });
  }

  @Delete('temporary/image')
  removeTemporaryImagePost(
    @Query('userId') userId: number = 0,
  ): Observable<boolean> {
    of(removeUserImageTemporaryFolder(userId))
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('File Removed: Success');
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('File Removed: Completed');
        },
      });
    return of(true);
  }

  @Get('temporary/image/:fileName')
  getImagePostTemporary(
    @Param('fileName') fileName: string,
    @Query('userId') userId: number = 0,
    @Res() res,
  ) {
    console.log(fileName, userId);
    return res.sendFile(fileName, {
      root: `./images/temporary/users/${userId}`,
    });
  }

  @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
  @UseGuards(JwtGuard, IsCreatorGuard, RolesGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }

  @Get('user/image/:fileName')
  findUserImageByName(
    @Param('fileName') fileName: string,
    @Query('userId') userId: number = 0,
    @Res() res,
  ) {
    if (!fileName || userId == 0 || ['null', '[null]'].includes(fileName)) {
      return res.sendFile('blank-profile-picture.jpg', {
        root: './images/default',
      });
    }
    return res.sendFile(fileName, { root: `./images/users/${userId}` });
  }

  @Get('post/image/:fileName')
  findPostImageByName(
    @Param('fileName') fileName: string,
    @Query('userId') userId: number = 0,
    @Res() res,
  ) {
    if (!fileName || userId == 0 || ['null', '[null]'].includes(fileName)) {
      throw new HttpException('Given Post do not have image', 500);
    }
    return res.sendFile(fileName, { root: `./images/userPosts/${userId}` });
  }
}
