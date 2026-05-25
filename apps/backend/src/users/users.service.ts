import { OnModuleInit, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/common/entities/user.entity';
import { UpdateUserDto } from 'src/common/dto/users.dto';
import { hash } from 'bcrypt';
import { RanksService } from 'src/ranks/ranks.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly ranksService: RanksService,
  ) { }

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminUsername || !adminPassword) {
      throw new Error('Missing admin credentials');
    }

    const admin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (admin) return;

    const hashedPassword = await hash(adminPassword, 10);
    const defaultRank = await this.ranksService.getRankForScore(5000);

    const adminUser = this.userRepository.create({
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      role: UserRole.ADMIN,
      avatarUrl: 'http://localhost:5173/public/admin.png',
      score: 5000,
      rankId: defaultRank.id,
    });

    await this.userRepository.save(adminUser);
    console.log('Admin user created successfully!');
  }

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

  async getGlobalLeaderboard(count: number) {
    const users = await this.userRepository.find({
      select: { id: true, username: true, avatarUrl: true, score: true },
      order: { score: 'DESC', username: 'ASC' },
      take: count,
    });

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      score: u.score,
    }));
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
