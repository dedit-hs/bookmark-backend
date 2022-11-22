import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './models/user.schema';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserData: CreateUserInput) {
    await this.validateCreateUserData(createUserData);
    const userDocument = await this.usersRepository.create({
      ...createUserData,
      password: await bcrypt.hash(createUserData.password, 10),
    });
    return this.toModel(userDocument);
  }

  private async validateCreateUserData(createUserData: CreateUserInput) {
    try {
      await this.usersRepository.findOne({ email: createUserData.email });
    } catch (error) {}
    throw new UnprocessableEntityException('Email already exists.');
  }

  async getUser(getUserArgs: GetUserArgs) {
    const userDocument = await this.usersRepository.findOne(getUserArgs);
    return this.toModel(userDocument);
  }

  async validateUser(email: string, password: string) {
    const userDocument = await this.usersRepository.findOne({ email });
    const validatePassword = await bcrypt.compare(
      password,
      userDocument.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return this.toModel(userDocument);
  }

  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toHexString(),
      email: userDocument.email,
    };
  }
}
