import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounterUserDto } from './dto/counter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ToolsService } from '../utils/tools.service';
import { JwtService } from '@nestjs/jwt';
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3RyaW5nIiwic3ViIjoxLCJpYXQiOjE2NTIxNjQ3MzQsImV4cCI6MTY1MjE5MzUzNH0.IXiNTvB4RFvbuLqw_PSk1RuzxsnNERrw3Ovk-oxEfTQ
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly toolsService: ToolsService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CounterUserDto) {
    const salt = this.toolsService.makeSalt(); // 制作密码盐
    const hashPwd = this.toolsService.encryptPassword(
      createUserDto.password,
      salt,
    ); // 加密密码
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashPwd,
      salt: salt,
    });
    return await this.userRepository.save(user);
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  async findOne(key: number | string) {
    if (typeof key === 'number') {
      return await this.userRepository.findOne({
        where: { id: key },
      });
    }
    if (typeof key === 'string') {
      return await this.userRepository.findOne({
        where: { username: key },
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id: id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id: id });
  }

  async login(user: any): Promise<any> {
    const payload = { name: user.username, sub: user.id };
    return {
      data: {
        token: `Bearer ${this.jwtService.sign(payload)}`,
      },
    };
  }

  async counter(id: number, counterUserDto: CounterUserDto) {
    return await this.userRepository.update({ id: id }, counterUserDto);
  }
}
