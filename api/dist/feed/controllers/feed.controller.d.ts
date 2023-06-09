/// <reference types="multer" />
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post/post.interface';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    create(file: Express.Multer.File, content: FeedPost, req: any): Observable<FeedPost>;
    createPostWithImage(file: Express.Multer.File, content: FeedPost, req: any): Observable<FeedPost>;
    findSelected(take?: number, skip?: number): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    updateImagePost(file: Express.Multer.File, id: number): Observable<{
        newFilename?: string;
        error?: string;
    }>;
    deletePost(id: number): Observable<DeleteResult>;
    findUserImageByName(fileName: string, userId: number, res: any): any;
    findPostImageByName(fileName: string, userId: number, res: any): any;
}
