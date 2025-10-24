import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterUserDto } from './dto/register.user.dto';
import type { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
