import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/common/entities/user.entity';
import { UpdateUserDto } from 'src/common/dto/users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async getUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const { password, ...rest } = updateUserDto as any;
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
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        await this.userRepository.remove(user);

        return { message: 'User deleted successfully.' };
    }

    async findById(id: string) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({ where: { username } });
    }

    async findByEmailOrUsername(email: string, username: string) {
        return this.userRepository.findOne({
            where: [{ email }, { username }],
        });
    }
}
