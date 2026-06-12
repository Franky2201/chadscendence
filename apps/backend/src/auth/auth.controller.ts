import type { Request, Response } from "express";
import {
    Controller,
    Post,
    Body,
    Get,
    Res,
    UseGuards,
    ForbiddenException,
    Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { GetUser } from "../common/decorators/get-user.decorator";
import type { OAuthProfile, AuthResponse } from "@chad/types";
import { CreateUserDto, LoginUserDto } from "./auth.dto";
import { IntraAuthGuard } from "../common/guards/intra.guard";
import { GithubAuthGuard } from "../common/guards/github.guard";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Controller("auth")
export class AuthController {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private configService: ConfigService,
        private usersService: UsersService,
    ) {}

    @Get("check")
    async checkAuthStatus(@Req() req: Request) {
        const token = req.cookies["access_token"] as string | undefined;

        if (!token) {
            return { isAuthenticated: false, user: null };
        }

        try {
            const payload = await this.jwtService.verifyAsync<{ sub: string }>(
                token,
                {
                    secret: this.configService.get<string>("JWT_SECRET") || "",
                },
            );
            const user = await this.usersService.findById(payload.sub);

            return { isAuthenticated: true, user };
        } catch {
            return { isAuthenticated: false, user: null };
        }
    }

    @Post("register")
    async register(
        @Body() body: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponse> {
        const token = await this.authService.register({ authregister: body });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return { success: true };
    }

    @Post("login")
    async login(
        @Body() body: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponse> {
        const token = await this.authService.login({ authlogin: body });

        res.cookie("access_token", token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
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
        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ||
            `https://${this.configService.get<string>("DOMAIN_NAME") || "localhost"}`;
        try {
            const token = await this.authService.registerOAuth({
                ...user,
                provider: "42",
            });

            res.cookie("access_token", token.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            return res.redirect(frontendUrl);
        } catch (err) {
            if (err instanceof ForbiddenException)
                return res.redirect(`${frontendUrl}?error=banned`);
            throw err;
        }
    }

    @Get("github")
    @UseGuards(GithubAuthGuard)
    async GithubAuth() {}

    @Get("github/callback")
    @UseGuards(GithubAuthGuard)
    async githubCallback(@GetUser() user: OAuthProfile, @Res() res: Response) {
        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ||
            `https://${this.configService.get<string>("DOMAIN_NAME") || "localhost"}`;
        try {
            const token = await this.authService.registerOAuth({
                ...user,
                provider: "github",
            });

            res.cookie("access_token", token.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            return res.redirect(frontendUrl);
        } catch (err) {
            if (err instanceof ForbiddenException)
                return res.redirect(`${frontendUrl}?error=banned`);
            throw err;
        }
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response): AuthResponse {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return { success: true };
    }
}
