import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { UpdateUserDto } from 'src/common/dto/users.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { rank: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    const dataToUpdate: Partial<User> = { ...rest };

    if (password) {
      dataToUpdate.password = await hash(password, 10);
    }

    await this.userRepository.save({ id, ...dataToUpdate });

    return this.getUser(id);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully.' };
  }

  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: { rank: true },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: { rank: true },
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: { rank: true },
    });
  }

  async findByEmailOrUsername(email: string, username: string) {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
      relations: { rank: true },
    });
  }
}
