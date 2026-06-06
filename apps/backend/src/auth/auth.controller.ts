import type { Response } from "express";
import { Controller, Post, Body, Get, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { OAuthProfile } from "../common/dto/auth.dto";
import { CreateUserDto, LoginUserDto } from "../common/dto/auth.dto";
import { IntraAuthGuard } from "../common/guards/intra.guard";
import { GithubAuthGuard } from "../common/guards/github.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(
        @Body() body: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.register({ authregister: body });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return { success: true };
    }

    @Post("login")
    async login(
        @Body() body: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const token = await this.authService.login({ authlogin: body });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return { success: true };
    }

    @Get("42")
    @UseGuards(IntraAuthGuard)
    async intraAuth() {}

    @Get("42/callback")
    @UseGuards(IntraAuthGuard)
    async intraAuthCallback(
        @GetUser() user: OAuthProfile,
        @Res() res: Response,
    ) {
        const token = await this.authService.registerOAuth({
            ...user,
            provider: "42",
        });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(frontendUrl);
    }

    @Get("github")
    @UseGuards(GithubAuthGuard)
    async GithubAuth() {}

    @Get("github/callback")
    @UseGuards(GithubAuthGuard)
    async githubCallback(@GetUser() user: OAuthProfile, @Res() res: Response) {
        const token = await this.authService.registerOAuth({
            ...user,
            provider: "github",
        });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(frontendUrl);
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return { success: true };
    }
}
