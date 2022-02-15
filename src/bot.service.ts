import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Bot, Prisma } from '@prisma/client';

@Injectable()
export class BotService {
  constructor(private prisma: PrismaService) {}

  async getBot(
    botWhereUniqueInput: Prisma.BotWhereUniqueInput,
  ): Promise<Bot | null> {
    return this.prisma.bot.findUnique({
      where: botWhereUniqueInput,
    });
  }

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

  async updateBot(params: {
    where: Prisma.BotWhereUniqueInput;
    data: Prisma.BotUpdateInput;
  }): Promise<Bot> {
    const { where, data } = params;
    return this.prisma.bot.update({
      data,
      where,
    });
  }

  async createUser(data: Prisma.BotCreateInput): Promise<Bot> {
    return this.prisma.bot.create({
      data,
    });
  }
}
