import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { configModuleOptions } from './config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { sequelizeConfigOpts } from './config/sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync(sequelizeConfigOpts),
    ConfigModule.forRoot(configModuleOptions),
    AuthModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
