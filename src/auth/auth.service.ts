import {
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LoginDto, RegisterDto } from './auth.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Config, IConfig } from 'src/config';

interface JwtPayload {
    sub: number;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly user: typeof User,
        private readonly config: ConfigService<IConfig>,
    ) { }

    private logger = new Logger(AuthService.name);

    private compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }

    private generateJwt(data: JwtPayload) {
        const jwtConfig = this.config.get(Config.Jwt, { infer: true });
        const token = jwt.sign(data, jwtConfig.secret, {
            expiresIn: '1d',
        });

        return token;
    }

    async register(data: RegisterDto): Promise<{ access_token: string }> {
        // check for existing user
        const existingUser = await this.user.findOne({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exist');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.user.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            hash: hashedPassword,
        });

        const token = this.generateJwt({ sub: user.id });
        return { access_token: token };
    }


    async login(data: LoginDto): Promise<{ access_token: string }> {
        // check db for email
        const user = await this.user.findOne({
            where: { email: data.email },
        });

        if (!user) {
            this.logger.debug(`email not found for ${data.email}`);
            throw new UnauthorizedException('Unable to log in, check if your email is correct');
        }
        // compare hashed password
        const passwordMatch = this.compare(data.password, user.hash);

        if (!passwordMatch) {
            throw new UnauthorizedException('Incorrect Password');
        }

        const token = this.generateJwt({ sub: user.id });
        return { access_token: token };
    }

}