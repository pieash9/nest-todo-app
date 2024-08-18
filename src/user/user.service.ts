import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;
  constructor(
    @InjectRepository(User) private readonly baseRepository: Repository<User>,
  ) {
    this.userRepository = baseRepository.extend({});
  }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    user.role = Constants.ROLES.NORMAL_ROLE;
    return this.userRepository.save(user);
  }

  findUserById(id: number) {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
