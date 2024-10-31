import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { register } from 'module';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
//import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  //@UseGuards(ThrottlerGuard)
  @Post('/login')
  handleLogin( @Req() req, @Res({passthrough: true}) res) {
    return this.authService.login(req.user, res);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('')
  create(@Body() registerUserDto: RegisterUserDto, @Res({passthrough: true}) res) {
    return this.authService.register(registerUserDto, res);
  }

  @Post('/logout')
  async handleLogout(@Req() req, @Res({passthrough: true}) response: Response){
    return await this.authService.logout(req.user, response)
  }
}
