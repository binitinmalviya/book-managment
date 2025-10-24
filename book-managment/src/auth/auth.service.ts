import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    const { password, __v, ...userWithoutSensitive } = user.toObject();
    return {
      success: true,
      statusCode: 201,
      user: userWithoutSensitive,
      access_token: token,
      message: 'user created successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailAndRole(
      loginDto.email,
      loginDto.role,
    );

    if (!user) {
      throw new NotFoundException(
        'User with this email and role does not exist',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user._id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    const { password, __v, ...userWithoutSensitive } = user.toObject();

    return {
      success: true,
      statusCode: 200,
      user: userWithoutSensitive,
      access_token: token,
      message: 'User logged in successfully',
    };
  }
}
