import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import { ToolsService } from '../utils/tools.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/guards/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }), //配置默认策略,其他配置:{session: true}
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' }, // token 过期时效,'8h'
    }),
  ],
  controllers: [UserController],
  providers: [UserService, Logger, ToolsService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
