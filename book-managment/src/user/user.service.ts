import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto/register.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterUserDto) {
    try {
      return await this.userModel.create({
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: registerUserDto.role,
      });
    } catch (err: unknown) {
      const e = err as {
        code?: number;
        keyPattern?: { email: string };
        keyValue?: { email: string };
      };

      const DUPLICATE_CODE_KEY = 11000;
      if (e.code == DUPLICATE_CODE_KEY) {
        throw new ConflictException(
          `This email ${e?.keyValue?.email || ''} is already taken.`,
        );
      }

      throw err;
    }
  }

  async findByEmailAndRole(email: string, role: string) {
    const user = this.userModel.findOne({ email, role });
    return user;
  }
}
