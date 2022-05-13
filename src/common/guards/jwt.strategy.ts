import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
//可添加第二个string参数,自定义策略名
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //提取请求头中的 Authorization 承载的 Token 信息
      ignoreExpiration: false, //默认 false ，对于没有过期的 JWT 信息继续委托 Passport 下的任务，过期则提示 401 的 http 状态码
      secretOrKey: process.env.JWT_SECRET, //签名所需要的密钥信息
    });
  }

  // JWT验证
  // Passport 解密后会调用 validate() 方法，将解码的 JSON 作为参数传递，确保给客户端发送是有效期的 token 信息。
  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
