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
} from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post/post.interface';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { savePostImageToStorage } from 'src/helpers/image-storage';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file')) // you need this to form-data works
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() content: FeedPost,
    @Request() req,
  ): Observable<FeedPost> {
    return this.feedService.createPost(req.user, content);
  }

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', savePostImageToStorage))
  @Post('image')
  createPostWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() content: FeedPost,
    @Request() req,
  ): Observable<FeedPost> {
    let fullImagePath = '';
    const { id: userId } = req.user;

    const fileName = file?.filename;
    if (fileName) {
      const imageFolderPath = join(process.cwd(), `images/userPosts/${userId}`);
      fullImagePath = join(imageFolderPath + '/' + file.filename);
    }

    return this.feedService.createPostWithImage(
      req.user,
      content,
      fileName,
      fullImagePath,
    );
  }

  // @Get()
  // getAllPosts(): Observable<FeedPost[]> {
  //   return this.feedService.findAllPosts();
  // }

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
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, feedPost);
  }

  @Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }

  @Get('image/:fileName')
  findImageByName(
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
}
