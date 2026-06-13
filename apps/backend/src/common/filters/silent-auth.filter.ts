import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class SilentAuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const msg = exception.getResponse();

        // If it's a 401 or 403, return 200 but with the error info
        // This avoids red console logs in the browser while letting the frontend know what happened.
        if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
            return response.status(HttpStatus.OK).json({
                success: false,
                statusCode: status,
                message: typeof msg === 'string' ? msg : (msg as any).message || 'Unauthorized',
                error: true
            });
        }

        response.status(status).json(msg);
    }
}
