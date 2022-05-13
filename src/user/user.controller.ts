import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CounterUserDto } from './dto/counter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ValidationPipe } from 'src/common/pipes/validator.pipe';

@ApiTags('用户模块(UserModule)')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '注册用户',
  })
  @Post()
  create(@Body() counterUserDto: CounterUserDto) {
    return this.userService.create(counterUserDto);
  }

  @ApiOperation({
    summary: '查找用户的信息',
  })
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '更改用户信息',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '用户注销',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.remove(+id);
  }
  @ApiOperation({
    summary: '用户登录',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() counterUserDto: CounterUserDto, @Request() req) {
    //前端传来的是@Body() userdto: UserDTO,但是我们添加了守卫,守卫返回了一个user
    return this.userService.login(req.user);
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更改用户名或密码',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('counter')
  counter(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() counterUserDto: CounterUserDto,
    @Request() req,
  ) {
    return this.userService.counter(id, counterUserDto);
  }
}
