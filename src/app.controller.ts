import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { session } from './data/session';
import { CreateBotDto } from './utils/ig-queque/dto/createBotDto';
import { getUserStory } from './utils/ig-requests/getStory';
import { restoreState } from './utils/ig-requests/restoreState';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user/:targetUser/story')
  @ApiParam({ name: 'targetUser', required: true })
  async getHello(@Param('targetUser') targetUser) {
    const result = await this.appService.getUserStory(targetUser);
    if (!result) {
      throw new NotFoundException({ err: 'User not found' });
    }
    return result;
  }

  @Get('auth/session')
  @ApiParam({ name: 'targetUser', required: true })
  async getSession(@Param('targetUser') targetUser) {
    const ig = await this.appService.getBot({
      username: 'cacetefake',
      password: '1312312321i3ij23inn2i1nini213ni',
      proxy: 'http://Lrp7e3qE:vHcHa6xx@194.226.184.45:64723',
    });

    const state = JSON.stringify(ig.state);
    return state;
  }

  @Get('debug-story/:targetUser')
  @ApiParam({ name: 'targetUser', required: true })
  async getStory(@Param('targetUser') targetUser) {
    const ig = await restoreState(JSON.stringify(session));
    return await getUserStory(ig, targetUser);
  }

  @Post('bot')
  async create(@Body() createBotDto: CreateBotDto) {
    this.appService.createBot(createBotDto);
  }
}
