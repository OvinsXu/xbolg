import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { ToolsService } from '../../utils/tools.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly toolsService: ToolsService,
  ) {
    super();
  }

  // 默认POST请求的数据格式:{"username":"","password":""}
  // 如果格式:{"hh":"","ee":""}
  // 则函数这么写:validate({"hh":"","ee":""})
  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    //console.log(user);
    if (user != null) {
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = this.toolsService.encryptPassword(
        password,
        user.salt,
      );
      if (user.password === hashPassword) {
        const { password, ...result } = user;
        return result;
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
