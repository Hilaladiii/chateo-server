import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prismaService: PrismaService) {}

  async getUserContact(userId: string) {
    const contact = await this.prismaService.userSaved.findMany({
      where: {
        userId,
      },
      select: {
        savedUser: {
          select: {
            id: true,
            username: true,
            image: true,
            bio: true,
          },
        },
      },
      orderBy: {
        savedUser: {
          username: 'asc',
        },
      },
    });

    if (!contact) throw new NotFoundException('Contact not found!');
    const savedUser = contact.map((ct) => ct.savedUser);
    return savedUser;
  }

  async findContact(userId: string) {
    if (!userId) throw new BadRequestException('user id required');
    const contact = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        image: true,
        bio: true,
      },
    });

    if (!contact) throw new NotFoundException('Contact not found!');

    return contact;
  }

  async saveUserContact(userId: string, userSavedId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userSavedId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isAlreadySaved = await this.prismaService.userSaved.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            savedUserId: userSavedId,
          },
        ],
      },
    });

    if (isAlreadySaved) throw new BadRequestException('Contact already saved');
    await this.prismaService.userSaved.create({
      data: {
        userId: userId,
        savedUserId: userSavedId,
      },
    });
  }
}
