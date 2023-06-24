/// <reference types="multer" />
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post/post.interface';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
export declare class FeedController {
    private feedService;
    constructor(feedService: FeedService);
    create(post: FeedPost, req: any): Observable<FeedPost>;
    findSelected(take?: number, skip?: number): Observable<FeedPost[]>;
    updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult>;
    saveImagePostTemporary(file: Express.Multer.File): Observable<{
        newFilename?: string;
        error?: string;
    }>;
    removeTemporaryImagePost(userId?: number): void;
    getImagePostTemporary(fileName: string, userId: number, res: any): any;
    removeImageFromPost(id: number, body: {
        imageName: string;
    }, req: any): Observable<UpdateResult>;
    deletePost(id: number): Observable<DeleteResult>;
    findUserProfileImageByName(fileName: string, userId: number, res: any): any;
    findPostImageByName(fileName: string, userId: number, res: any): any;
}
