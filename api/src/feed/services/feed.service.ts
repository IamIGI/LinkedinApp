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
    console.log(post);
    console.log(Boolean(post.imageName));

    if (post.imageName) {
      of(copyImageFromTemporaryToUserPost(post.imageName, user.id))
        .pipe(take(1))
        .subscribe({
          next: () => {
            console.log('File Copied: Success');
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('File Copied: Completed');
          },
        });
    }

    return from(this.feedPostRepository.save(post));
  }

  updatePost(id: number, newPost: FeedPost): Observable<UpdateResult> {
    this.postHasBeenUpdated(newPost);
    console.log(3.0, 'Update post service: start');
    console.log(3.1, newPost);

    //
    const copyNewImage = this.findPostById(id).pipe(
      take(1),
      map((oldPostData: FeedPost) => {
        console.log(
          3.2,
          newPost.imageName,
          oldPostData.imageName,
          newPost.imageName !== oldPostData.imageName,
        );
        if (newPost.imageName !== oldPostData.imageName) {
          console.log(3.3, 'Rozpoczeto kopiowanie nowego zdjeice');
          console.log(oldPostData.imageName);
          console.log(oldPostData.author.id);
          // console.log(newPost);
          of(
            copyImageFromTemporaryToUserPost(
              newPost.imageName,
              oldPostData.author.id,
            ),
          )
            .pipe(take(1))
            .subscribe({
              next: () => {
                console.log(3.31, 'File Copied: Success');
                deletePostImage(oldPostData.author.id, oldPostData.imageName);
              },
              error: (err: any) => {
                console.log(err);
              },
              complete: () => {
                console.log(3.2, 'File Copied: Completed');
              },
            });
        } else {
          console.log(3.3, 'Nie zmieniono zdjecia');
        }
      }),
    );

    return from(this.feedPostRepository.update(id, newPost)).pipe(
      tap(() => {
        console.log(2.9, 'Rozpoczeto aktualizowac baze danych ');
      }),
      delayWhen(() => copyNewImage),
      take(1),
      tap(() => {
        console.log(4.0, 'Skonczone aktualizowac baze danych');
      }),
    );
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

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }

  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedPostRepository.findOne({ where: { id }, relations: ['author'] }),
    );
  }
}
