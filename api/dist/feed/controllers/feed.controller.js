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
exports.FeedController = void 0;
const common_1 = require("@nestjs/common");
const feed_service_1 = require("../services/feed.service");
const rxjs_1 = require("rxjs");
const jwt_guard_1 = require("../../auth/guards/jwt.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../auth/models/role.enum");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const is_creator_guard_1 = require("../guards/is-creator.guard");
const platform_express_1 = require("@nestjs/platform-express");
const image_storage_1 = require("../../helpers/image-storage");
let FeedController = class FeedController {
    constructor(feedService) {
        this.feedService = feedService;
    }
    create(post, req) {
        return this.feedService.createPost(req.user, post);
    }
    findSelected(take = 1, skip = 1) {
        take = take > 20 ? 20 : take;
        return this.feedService.findPosts(take, skip);
    }
    updatePost(id, feedPost) {
        return this.feedService.updatePost(id, feedPost);
    }
    saveImagePostTemporary(file) {
        return (0, rxjs_1.of)({ newFilename: file.filename });
    }
    removeTemporaryImagePost(userId = 0) {
        (0, rxjs_1.of)((0, image_storage_1.removeUserImageTemporaryFolder)(userId)).pipe((0, rxjs_1.take)(1)).subscribe();
    }
    getImagePostTemporary(fileName, userId = 0, res) {
        return res.sendFile(fileName, {
            root: `./images/temporary/users/${userId}`,
        });
    }
    deletePost(id) {
        return this.feedService.deletePost(id);
    }
    findUserImageByName(fileName, userId = 0, res) {
        if (!fileName || userId == 0 || ['null', '[null]'].includes(fileName)) {
            return res.sendFile('blank-profile-picture.jpg', {
                root: './images/default',
            });
        }
        return res.sendFile(fileName, { root: `./images/users/${userId}` });
    }
    findPostImageByName(fileName, userId = 0, res) {
        if (!fileName || userId == 0 || ['null', '[null]'].includes(fileName)) {
            throw new common_1.HttpException('Given Post do not have image', 500);
        }
        return res.sendFile(fileName, { root: `./images/userPosts/${userId}` });
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.PREMIUM, role_enum_1.Role.USER),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], FeedController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('take')),
    __param(1, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], FeedController.prototype, "findSelected", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.PREMIUM),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, is_creator_guard_1.IsCreatorGuard, roles_guard_1.RolesGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], FeedController.prototype, "updatePost", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.PREMIUM),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', image_storage_1.saveUserImageToTemporaryStorage)),
    (0, common_1.Post)('temporary/image'),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], FeedController.prototype, "saveImagePostTemporary", null);
__decorate([
    (0, common_1.Delete)('temporary/image'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "removeTemporaryImagePost", null);
__decorate([
    (0, common_1.Get)('temporary/image/:fileName'),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "getImagePostTemporary", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.PREMIUM, role_enum_1.Role.USER),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, is_creator_guard_1.IsCreatorGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], FeedController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)('user/image/:fileName'),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "findUserImageByName", null);
__decorate([
    (0, common_1.Get)('post/image/:fileName'),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "findPostImageByName", null);
FeedController = __decorate([
    (0, common_1.Controller)('feed'),
    __metadata("design:paramtypes", [feed_service_1.FeedService])
], FeedController);
exports.FeedController = FeedController;
//# sourceMappingURL=feed.controller.js.map