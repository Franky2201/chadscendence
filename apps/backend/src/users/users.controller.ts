import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    UseGuards,
    Query,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { UpdateAdminUserDto, UpdateUserDto } from "../common/dto/users.dto";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { JwtPayload } from "../common/dto/auth.dto";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { Permissions } from "src/common/decorators/permissions.decorator";
import { PermissionAction } from "@chad/types";

const avatarUploadOptions = {
    storage: diskStorage({
        destination: "./uploads",
        filename: (
            _req: Express.Request,
            file: Express.Multer.File,
            cb: (err: Error | null, name: string) => void,
        ) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, unique + extname(file.originalname));
        },
    }),
    fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        cb: (err: Error | null, accept: boolean) => void,
    ) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(
                new BadRequestException("Seules les images sont acceptées."),
                false,
            );
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
};

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@GetUser() payload: JwtPayload) {
        return this.usersService.getUser(payload.sub);
    }

    @Patch("me")
    @UseGuards(JwtAuthGuard)
    updateUser(
        @GetUser() payload: JwtPayload,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.updateUser(payload.sub, updateUserDto);
    }

    @Post("me/avatar")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("file", avatarUploadOptions))
    uploadAvatar(
        @GetUser() payload: JwtPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException("Aucun fichier fourni.");
        return this.usersService.uploadAvatar(payload.sub, file.filename);
    }

    @Delete("me")
    @UseGuards(JwtAuthGuard)
    deleteUser(@GetUser() payload: JwtPayload) {
        return this.usersService.deleteUser(payload.sub);
    }

    @Post(":id/avatar")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_USERS)
    @UseInterceptors(FileInterceptor("file", avatarUploadOptions))
    uploadAvatarForUser(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException("Aucun fichier fourni.");
        return this.usersService.uploadAvatar(id, file.filename);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_USERS)
    adminUpdateUser(
        @Param("id") id: string,
        @Body() updateUserDto: UpdateAdminUserDto,
    ) {
        return this.usersService.adminUpdateUser(id, updateUserDto);
    }

    @Patch(":id/ban")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(PermissionAction.MANAGE_USERS)
    banUser(@Param("id") id: string) {
        return this.usersService.banUser(id);
    }


    @Get("search")
    @UseGuards(JwtAuthGuard)
    searchUsers(@Query("q") query: string, @GetUser() body: JwtPayload) {
        if (!query) return [];
        return this.usersService.searchUsers(query, body.sub);
    }

    @Get("me/leaderboard-rank")
    @UseGuards(JwtAuthGuard)
    getMyLeaderboardRank(@GetUser() payload: JwtPayload) {
        return this.usersService.getUserLeaderboardRank(payload.sub);
    }

    @Get("leaderboard")
    getGlobalLeaderboard(@Query("count") count: string = "10") {
        return this.usersService.getGlobalLeaderboard(Number(count));
    }
}
