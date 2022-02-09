import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Bot, Prisma } from '@prisma/client';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}
  async getBots(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BotWhereUniqueInput;
    where?: Prisma.BotWhereInput;
    orderBy?: Prisma.BotOrderByWithRelationInput;
  }): Promise<Bot[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bot.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
