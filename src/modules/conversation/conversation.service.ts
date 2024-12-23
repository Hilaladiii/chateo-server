import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dtos/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prismaService: PrismaService) {}

  async createConversation({
    name,
    members,
    isGroup,
    userId,
    currentUserId,
  }: CreateConversationDto & { currentUserId: string }) {
    if (isGroup && (!members || members.length < 2 || !name))
      throw new BadRequestException('Invalid data');

    if (isGroup) {
      const newConversation = await this.prismaService.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { id: string }) => ({
                id: member.id,
              })),
              {
                id: currentUserId,
              },
            ],
          },
        },
      });

      return newConversation;
    }

    const existingConversation = await this.prismaService.conversation.findMany(
      {
        where: {
          OR: [
            {
              userIds: {
                equals: [userId, currentUserId],
              },
            },
            {
              userIds: {
                equals: [currentUserId, userId],
              },
            },
          ],
        },
      },
    );

    const singleConversation = existingConversation[0];
    if (singleConversation) return;

    const newConversation = await this.prismaService.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUserId,
            },
            {
              id: userId,
            },
          ],
        },
      },
    });

    return newConversation;
  }
}
