import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { LoginDto, RegisterDto, } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async handleRegister(@Body() body: RegisterDto) {
        const data = await this.authService.register(body);

        return {
            message: "Successful Registration",
            data
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async handleLogin(@Body() body: LoginDto) {
        const data = await this.authService.login(body);
        return {
            message: "Login Successful",
            data
        }
    }
}
