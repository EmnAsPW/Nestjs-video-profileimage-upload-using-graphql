import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User, UserDetails, UserDocument } from './entities/user.entity';
import { UserService } from './user.service';

import { updateUserInput } from './dto/update-user.input';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { UseGuards } from '@nestjs/common';
import { UserVideo } from './entities/Uservideo.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserDetails, { name: 'getUser' })
  //@UseGuards(JwtGuard)
  async getUser(@Args('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }

  @Query(() => UserVideo, { name: 'getUserwithvideo' })
  async getUserwithvideo(@Args('id') id: string) {
    return this.userService.findByIdWithVideos(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('_id') _id: string,
    @Args('updateUserInput') updateUserInput: updateUserInput,
  ): Promise<User> {
    const {
      Username,
      email,
      password,
      confirmPassword,
      Address,
      Age,
      Bio,
      image,
    } = updateUserInput;
    //console.log(image);

    if (email) {
      if (!email?.endsWith('@gmail.com'))
        throw new Error('Email Must be valid');
    }
    if (password && !confirmPassword) {
      throw new Error('ConfirmPassword is required');
    }
    if (confirmPassword && !password) {
      throw new Error('Password is required');
    }
    if (password !== confirmPassword) {
      throw new Error('Password and confirmPassword do not match');
    }

    let updatedFields: any = {
      Username,
      email,
      password,
      confirmPassword,
      Address,
      Age,
      Bio,
    };
    // Here I'm checking if the image is provided in the updateUserInput
    if (image) {
      const { filename, mimetype, encoding, createReadStream } = await image;
      //console.log(filename, mimetype, encoding, createReadStream);
      if (
        mimetype !== 'image/jpg' &&
        mimetype !== 'image/PNG' &&
        mimetype !== 'image/JPEG' &&
        mimetype !== 'application/octet-stream'
      ) {
        throw new Error('Only jpg & PNG image files are allowed.');
      }
      const ReadStream = createReadStream();
      // console.log(__dirname);
      const newFilename = `${Date.now()}-${filename}`;
      let savePath = join(__dirname, '..', '..', 'upload', newFilename);
      const writeStream = await createWriteStream(savePath);
      await ReadStream.pipe(writeStream);
      const baseUrl = process.env.BASE_URL;
      const port = process.env.PORT;
      savePath = `${baseUrl}${port}\\${newFilename}`;
      console.log(savePath);
      // Here I add the updated image path to the fields to be updated
      updatedFields.image = savePath;
    }
    return await this.userService.updateuser(_id, updatedFields);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('_id') _id: string): Promise<User> {
    return await this.userService.deleteUser(_id);
  }

  @Mutation(() => String, { name: 'deleteOneUserInfo' })
  @UseGuards(JwtAuthGuard)
  async deleteOneField(
    @Args('userId', { type: () => String }) _id: string,
    @Args('fieldToDelete') fieldToDelete: string,
  ) {
    try {
      const result = await this.userService.deleteOneUserInfo(
        _id,
        fieldToDelete,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete field');
    }
  }
}

//   @Mutation(() => String, { name: 'updateOneUserInfo' })
//   @UseGuards(JwtAuthGuard)
//   async updateOneField(
//     @Args('userId', { type: () => String }) _id: string,
//     @Args('fieldToUpdate') fieldToUpdate: string,
//     @Args('newValue') newValue: string,
//   ) {
//     try {
//       const result = await this.userService.updateOneUserInfo(
//         _id,
//         fieldToUpdate,
//         newValue,
//       );
//       return result;
//     } catch (error) {
//       console.log(error);
//       throw new Error('Failed to update field');
//     }
//   }
// }

// import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// import { UserService } from './user.service';
// import { User } from './entities/user.entity';
// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
// import { Schema as MongooSchema } from 'mongoose';

// @Resolver(() => User)
// export class UserResolver {
//   constructor(private readonly userService: UserService) {}

//   @Mutation(() => User)
//   createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
//     return this.userService.createUser(createUserInput);
//   }

//   @Query(() => [User], { name: 'users' })
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Query(() => User, {
//     name: 'userById',
//     description: 'This will be like getting the user profile by his id',
//   })
//   getUserById(
//     @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
//   ) {
//     return this.userService.getUserById(id);
//   }

//   @Mutation(() => User)
//   updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
//     return this.userService.updateUser(updateUserInput._id, updateUserInput);
//   }

//   @Mutation(() => User)
//   removeUser(
//     @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
//   ) {
//     return this.userService.remove(id);
//   }
// }
