import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../models/post/post.entity';
import { FeedPost } from '../models/post/post.interface';
import { Observable } from 'rxjs';
import { User } from 'src/auth/models/user.interface';
export declare class FeedService {
    private readonly feedPostRepository;
    constructor(feedPostRepository: Repository<FeedPostEntity>);
    postHasBeenUpdated(feedPost: FeedPost): FeedPost;
    createPost(user: User, post: FeedPost): Observable<FeedPost>;
    updatePost(id: number, newPost: FeedPost): Observable<UpdateResult>;
    deleteImageFromPost(userId: number, imageName: string, postId: number): Observable<UpdateResult>;
    findPosts(take?: number, skip?: number): Observable<FeedPost[]>;
    findAllPosts(): Observable<FeedPost[]>;
    deletePost(id: number): Observable<DeleteResult>;
    findPostById(id: number): Observable<FeedPost>;
}
