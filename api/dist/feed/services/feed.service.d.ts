import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../models/post/post.entity';
import { FeedPost } from '../models/post/post.interface';
import { Observable } from 'rxjs';
import { User } from 'src/auth/models/user.interface';
export declare class FeedService {
    private readonly feedPostRepository;
    constructor(feedPostRepository: Repository<FeedPostEntity>);
    postHasBeenUpdated(feedPost: FeedPost): Date;
    createPost(user: User, feedPost: FeedPost): Observable<FeedPost>;
    findPosts(take?: number, skip?: number): Observable<FeedPost[]>;
    findAllPosts(): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findPostById(id: number): Observable<FeedPost>;
}
