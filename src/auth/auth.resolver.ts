import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User, UserDetails } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login.response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './gql-auth.guards';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserResponse, { name: 'Login' })
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput, // @Args('loginUserInput') _loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => UserDetails, { name: 'signup' })
  signup(@Args('signupInput') signupInput: CreateUserInput) {
    return this.authService.signup(signupInput);
  }
}
