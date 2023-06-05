import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../models/post/post.entity';
import { FeedPost } from '../models/post/post.interface';
import { from, map, Observable, switchMap } from 'rxjs';
import { User } from 'src/auth/models/user.interface';
import { isFileExtensionSafe, removeFile } from 'src/helpers/image-storage';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  postHasBeenUpdated(feedPost: FeedPost) {
    return (feedPost.updatedAt = new Date());
  }

  createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
    feedPost.author = user;
    return from(this.feedPostRepository.save(feedPost));
  }

  createPostWithImage(
    user: User,
    feedPost: FeedPost,
    imageName?: string,
    fullImagePath?: string,
  ): Observable<FeedPost> {
    feedPost.author = user;
    feedPost.imageName = imageName;

    return isFileExtensionSafe(fullImagePath).pipe(
      map((isFileLegit: boolean) => {
        if (!isFileLegit) {
          removeFile(fullImagePath);
          throw new HttpException('File content does not match extension', 500);
        } else {
          return feedPost;
        }
      }),
      switchMap((feedPost: FeedPost) => {
        return from(this.feedPostRepository.save(feedPost));
      }),
    );
  }

  findPosts(take: number = 10, skip: number = 0): Observable<FeedPost[]> {
    return from(
      this.feedPostRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.author', 'author')
        .orderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getMany(),
    );
  }

  findAllPosts(): Observable<FeedPost[]> {
    return from(this.feedPostRepository.find());
  }

  updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    this.postHasBeenUpdated(feedPost);
    return from(this.feedPostRepository.update(id, feedPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }

  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedPostRepository.findOne({ where: { id }, relations: ['author'] }),
    );
  }
}
