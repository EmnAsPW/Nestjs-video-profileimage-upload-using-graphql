import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDetails, UserDocument } from './entities/user.entity';
import { updateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserDetails {
    return {
      _id: user.id,
      Username: user.Username,
      email: user.email,
    };
  }

  async findByIdWithVideos(id: string) {
    const userWithVideos = await this.userModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'videos',
          localField: '_id',
          foreignField: 'userId',
          as: 'videos',
        },
      },
    ]);
    console.log('............', userWithVideos);
    return userWithVideos[0];
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async createUser(createUserInput: CreateUserInput) {
    const createdUser = new this.userModel(createUserInput);
    return createdUser.save();
  }

  async updateuser(
    _id: string,
    data: UpdateQuery<UserDocument> | updateUserInput,
  ): Promise<User> {
    if (data.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    if (data.confirmPassword) {
      const saltRounds = 10;
      data.confirmPassword = await bcrypt.hash(
        data.confirmPassword,
        saltRounds,
      );
    }
    return await this.userModel.findByIdAndUpdate(_id, data, { new: true });
  }

  async deleteUser(_id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(_id);
  }

  async deleteOneUserInfo(_id: string, fieldToDelete: string) {
    try {
      const user = await this.userModel.findById(_id).exec();

      if (!user) {
        return 'User Not Found';
      }

      if (user[fieldToDelete] !== undefined) {
        const updateQuery = { $unset: { [fieldToDelete]: 1 } };

        await this.userModel
          .findByIdAndUpdate(_id, updateQuery, { new: true })
          .exec();
        return `Successfully deleted ${fieldToDelete} from user`;
      } else {
        return `${fieldToDelete} not found in user`;
      }
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
}

// async updateOneUserInfo(
//   _id: string,
//   fieldToUpdate: string,
//   newValue: string,
// ) {
//   try {
//     const video = await this.userModel.findById(_id).exec();

//     if (!video) {
//       return 'User Not Found';
//     }

//     if (video[fieldToUpdate] !== undefined) {
//       const updateQuery = { [fieldToUpdate]: newValue };

//       const updatedUser = await this.userModel
//         .findByIdAndUpdate(_id, updateQuery, { new: true })
//         .exec();

//       return `Successfully updated ${fieldToUpdate} in User. New value: ${updatedUser[fieldToUpdate]}`;
//     } else {
//       return `${fieldToUpdate} not found in User`;
//     }
//   } catch (error) {
//     throw new NotFoundException('User Not Found');
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Schema as MongooSchema } from 'mongoose';
// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
// import { User, UserDocument } from './entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(User.name)
//     private userModel: Model<UserDocument>,
//     private readonly configService: ConfigService,
//   ) {}

//   findAll(skip = 0, limit = 10) {
//     // To implement later
//     return this.userModel.find().skip(skip).limit(limit);
//   }

//   getUserById(id: MongooSchema.Types.ObjectId) {
//     return this.userModel.findById(id);
//   }

//   async updateUser(
//     id: MongooSchema.Types.ObjectId,
//     updateUserInput: UpdateUserInput,
//   ) {
//     return await this.userModel.findByIdAndUpdate(id, updateUserInput, {
//       new: true,
//     });
//   }

//   remove(id: MongooSchema.Types.ObjectId) {
//     return this.userModel.deleteOne({ _id: id });
//   }
// }
