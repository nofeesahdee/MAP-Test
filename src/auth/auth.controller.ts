import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { LoginDto, RegisterDto, } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async handleRegister(@Body() body: RegisterDto) {
        const data = await this.authService.register(body);

        return data;
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async handleLogin(@Body() body: LoginDto) {
        const data = await this.authService.login(body);
        return data;
    }
}
