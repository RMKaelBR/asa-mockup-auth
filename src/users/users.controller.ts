import { Body, Controller, Post, Delete, Get, Patch, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { User } from './user.entity';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor (
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    // console.log("The user's id: " + user.id);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/whoamidatasource')
  async whoAmIDataSource(@CurrentUser() user: User) {
    const dauser = await this.usersService.findOneDataSource(user.id);
    
    if(!dauser) {
      throw new NotFoundException('user not found.');
    }
    return dauser;
  }

  @Get('/checkadmin')
  @UseGuards(AdminGuard)
  async checkAdmin(@CurrentUser() user: User) {
    console.log(`The user of id ${user.id} has admin set to: ${user.admin}`);
    return user.admin;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body:CreateUserDto, @Session() session: any){
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email:string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
