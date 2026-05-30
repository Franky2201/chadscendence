import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/common/guards/jwt.guard";
import { UpdateUserDto } from "src/common/dto/users.dto";
import { GetUser } from "src/common/decorators/get-user.decorator";
import type { JwtPayload } from "src/common/dto/auth.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

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
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads",
                filename: (_req, file, cb) => {
                    const unique =
                        Date.now() + "-" + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.startsWith("image/")) {
                    return cb(
                        new BadRequestException(
                            "Seules les images sont acceptées.",
                        ),
                        false,
                    );
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
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
