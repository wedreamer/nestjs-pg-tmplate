import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@app/db';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, UserModule, RoleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
