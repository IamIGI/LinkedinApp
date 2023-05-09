import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    create(post: FeedPost): Observable<FeedPost>;
    findSelected(take?: number, skip?: number): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
}
