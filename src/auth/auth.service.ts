import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.input';
//import { USER_ALREADY_EXIST_EXCEPTION } from '../common/exceptions/user.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        'Invalid email. Please check your email address.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Invalid password. Please check your password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          email: user.email,
          name: user.Username,
          sub: user._id,
        },
        {
          secret:
            this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
        },
      ),
    };
  }

  async signup(payload: CreateUserInput) {
    // CHECK IF THE USER ALREADY EXISTS
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );
    }

    if (payload.password !== payload.confirmPassword) {
      throw new HttpException(
        'Password and Confirm Password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.email.endsWith('@gmail.com')) {
      throw new HttpException(
        'Only Gmail addresses are allowed for registration',
        HttpStatus.BAD_REQUEST,
      );
    }

    // GENERATE HASH PASSWORDS TO SAVE
    const hashPassword = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUND') || '8'),
    );

    const hashConfirmPassword = await bcrypt.hash(
      payload.confirmPassword,
      Number(this.configService.get<string>('SALT_ROUND') || '8'),
    );

    return this.userService.createUser({
      ...payload,
      password: hashPassword,
      confirmPassword: hashConfirmPassword,
    });
  }
}
