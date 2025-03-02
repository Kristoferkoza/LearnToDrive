import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  // @Permission('users')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  // @Permission('users')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  // @Permission('users')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // @Post(':id/set-password')
  // // @Permission('users')
  // setPassword(@Param('id') id: string, @Body('password') password: string) {
  //   return this.usersService.setPassword(id, password);
  // }
}
