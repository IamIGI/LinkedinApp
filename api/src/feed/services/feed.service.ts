import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../models/post/post.entity';
import { FeedPost } from '../models/post/post.interface';
import {
  concatMap,
  mergeMap,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  exhaustMap,
  delayWhen,
} from 'rxjs';
import { User } from 'src/auth/models/user.interface';
import {
  copyImageFromTemporaryToUserPost,
  deletePostImage,
  isFileExtensionSafe,
  removeFile,
  removeUserImageTemporaryFolder,
} from 'src/helpers/image-storage';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  postHasBeenUpdated(feedPost: FeedPost) {
    return (feedPost.updatedAt = new Date());
  }

  createPost(user: User, post: FeedPost): Observable<FeedPost> {
    post.author = user;

    if (post.imageName) {
      of(copyImageFromTemporaryToUserPost(post.imageName, user.id))
        .pipe(take(1))
        .subscribe();
    }

    return from(this.feedPostRepository.save(post));
  }

  updatePost(id: number, newPost: FeedPost): Observable<UpdateResult> {
    if (!newPost.content || newPost.content === '') return;
    this.postHasBeenUpdated(newPost);

    //
    const copyNewImage = this.findPostById(id).pipe(
      take(1),
      map((oldPostData: FeedPost) => {
        if (newPost.imageName && newPost.imageName !== oldPostData.imageName) {
          of(
            copyImageFromTemporaryToUserPost(
              newPost.imageName,
              oldPostData.author.id,
            ),
          )
            .pipe(take(1))
            .subscribe({
              next: () => {
                deletePostImage(oldPostData.author.id, oldPostData.imageName);
              },
              error: (err: any) => {
                console.log(err);
              },
              complete: () => {},
            });
        }
      }),
    );
    return from(this.feedPostRepository.update(id, newPost)).pipe(
      delayWhen(() => copyNewImage),
      take(1),
    );
  }

  //PostId: 0 => Post not exists
  deleteImageFromPost(
    userId: number,
    imageName: string,
    postId: number,
  ): Observable<UpdateResult> {
    const updatedPost: FeedPost = { imageName: null };

    removeUserImageTemporaryFolder(userId);

    if (postId != 0) {
      deletePostImage(userId, imageName);
      return from(this.feedPostRepository.update(postId, updatedPost));
    }
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

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }

  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedPostRepository.findOne({ where: { id }, relations: ['author'] }),
    );
  }
}
