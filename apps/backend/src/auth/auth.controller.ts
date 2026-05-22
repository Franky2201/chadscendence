import type { Response } from 'express';
import { Controller, Post, Body, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { CreateUserDto, LoginUserDto } from 'src/common/dto/auth.dto';
import { IntraAuthGuard } from 'src/common/guards/intra.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.register({ authregister: body });

        res.cookie('access_token', token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { success: true };
    }

    @Post('login')
    async login(@Body() body: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.login({ authlogin: body });

        res.cookie('access_token', token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { success: true };
    }

    @Get('42')
    @UseGuards(IntraAuthGuard)
    async intraAuth() {
    }

    @Get('42/callback')
    @UseGuards(IntraAuthGuard)
    async intraAuthCallback(@GetUser() user: User, @Res() res: Response) {
        const token = await this.authService.registerOAuth(user);

        res.cookie('access_token', token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return res.redirect('http://localhost:5173/');
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { success: true };
    }
}
