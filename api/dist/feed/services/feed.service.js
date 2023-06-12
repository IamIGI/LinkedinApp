"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../models/post/post.entity");
const rxjs_1 = require("rxjs");
const image_storage_1 = require("../../helpers/image-storage");
let FeedService = class FeedService {
    constructor(feedPostRepository) {
        this.feedPostRepository = feedPostRepository;
    }
    postHasBeenUpdated(feedPost) {
        return (feedPost.updatedAt = new Date());
    }
    createPost(user, post) {
        post.author = user;
        if (post.imageName) {
            (0, rxjs_1.of)((0, image_storage_1.copyImageFromTemporaryToUserPost)(post.imageName, user.id))
                .pipe((0, rxjs_1.take)(1))
                .subscribe();
        }
        return (0, rxjs_1.from)(this.feedPostRepository.save(post));
    }
    updatePost(id, newPost) {
        this.postHasBeenUpdated(newPost);
        const copyNewImage = this.findPostById(id).pipe((0, rxjs_1.take)(1), (0, rxjs_1.map)((oldPostData) => {
            if (newPost.imageName !== oldPostData.imageName) {
                (0, rxjs_1.of)((0, image_storage_1.copyImageFromTemporaryToUserPost)(newPost.imageName, oldPostData.author.id))
                    .pipe((0, rxjs_1.take)(1))
                    .subscribe({
                    next: () => {
                        (0, image_storage_1.deletePostImage)(oldPostData.author.id, oldPostData.imageName);
                    },
                    error: (err) => {
                        console.log(err);
                    },
                    complete: () => { },
                });
            }
        }));
        return (0, rxjs_1.from)(this.feedPostRepository.update(id, newPost)).pipe((0, rxjs_1.delayWhen)(() => copyNewImage), (0, rxjs_1.take)(1));
    }
    deleteImageFromPost(postId, userId, imageName) {
        const updatedPost = { imageName: null };
        (0, image_storage_1.deletePostImage)(userId, imageName);
        return (0, rxjs_1.from)(this.feedPostRepository.update(postId, updatedPost));
    }
    findPosts(take = 10, skip = 0) {
        return (0, rxjs_1.from)(this.feedPostRepository
            .createQueryBuilder('post')
            .innerJoinAndSelect('post.author', 'author')
            .orderBy('post.createdAt', 'DESC')
            .take(take)
            .skip(skip)
            .getMany());
    }
    findAllPosts() {
        return (0, rxjs_1.from)(this.feedPostRepository.find());
    }
    deletePost(id) {
        return (0, rxjs_1.from)(this.feedPostRepository.delete(id));
    }
    findPostById(id) {
        return (0, rxjs_1.from)(this.feedPostRepository.findOne({ where: { id }, relations: ['author'] }));
    }
};
FeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.FeedPostEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeedService);
exports.FeedService = FeedService;
//# sourceMappingURL=feed.service.js.map