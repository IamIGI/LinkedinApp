import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';
import { Observable } from 'rxjs';
export declare class FeedService {
    private readonly feedPostRepository;
    constructor(feedPostRepository: Repository<FeedPostEntity>);
    postHasBeenUpdated(feedPost: FeedPost): Date;
    createPost(feedPost: FeedPost): Observable<FeedPost>;
    findAllPosts(): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
}
