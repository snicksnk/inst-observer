import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { catchError, take, throwError } from 'rxjs';
import { AppService } from './app.service';
import { session } from './data/session';
import { CreateBotDto, UpdateBotDto } from './utils/ig-queque/dto/createBotDto';
import { getUserStory } from './utils/ig-requests/getStory';
import { restoreState } from './utils/ig-requests/restoreState';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user/:targetUser/story/:skip')
  @ApiParam({ name: 'targetUser', required: true })
  @ApiParam({ name: 'skip', required: true })
  async getStoryes(@Param('targetUser') targetUser, @Param('skip') skip) {
    const result = (
      await this.appService.getUserStory(targetUser, parseInt(skip))
    ).pipe(
      take(1),
      catchError((e) => throwError(new ForbiddenException({ e }))),
    );

    if (!result) {
      throw new NotFoundException({ err: 'User not found' });
    }
    return result;
  }

  @Get('user/:targetUser/highlighted-list')
  @ApiParam({ name: 'targetUser', required: true })
  async getHighlightedList(
    @Param('targetUser') targetUser,
    @Param('skip') skip,
  ) {
    const result = (await this.appService.getHighligtedList(targetUser)).pipe(
      take(1),
      catchError((e) => throwError(new ForbiddenException({ e }))),
    );
    if (!result) {
      throw new NotFoundException({ err: 'User not found' });
    }
    return result;
  }

  @Get('user/:targetUser/highlighted/:skip')
  @ApiParam({ name: 'targetUser', required: true })
  @ApiParam({ name: 'skip', required: true })
  async getHighlighted(@Param('targetUser') targetUser, @Param('skip') skip) {
    const result = (
      await this.appService.getHighligted(targetUser, parseInt(skip))
    ).pipe(
      take(1),
      catchError((e) => throwError(new ForbiddenException({ e }))),
    );
    if (!result) {
      throw new NotFoundException({ err: 'User not found' });
    }
    return result;
  }

  // @Get('auth/session')
  // @ApiParam({ name: 'targetUser', required: true })
  // async getSession(@Param('targetUser') targetUser) {
  //   const ig = await this.appService.getBot({
  //     username: 'cacetefake',
  //     password: '1312312321i3ij23inn2i1nini213ni',
  //     proxy: 'http://Lrp7e3qE:vHcHa6xx@194.226.184.45:64723',
  //   });

  //   const state = JSON.stringify(ig.state);
  //   return state;
  // }

  @Get('debug-story/:targetUser')
  @ApiParam({ name: 'targetUser', required: true })
  async getStory(@Param('targetUser') targetUser) {
    const ig = await restoreState(JSON.stringify(session));
    return await getUserStory(ig, targetUser, {});
  }

  @Get('bot/status')
  async getBotStatus() {
    const status = await this.appService.getBotStatus();
    return status;
  }

  @Post('bot')
  async createBot(@Body() createBotDto: CreateBotDto) {
    try {
      return this.appService.createBot(createBotDto);
    } catch (e) {
      return e;
    }
  }

  @Patch('bot/:username/restore')
  @ApiParam({ name: 'username', required: true })
  async updateBot(
    @Param('username') username,
    @Body() updateBot: UpdateBotDto,
  ) {
    try {
      return this.appService.updateBot(username, updateBot);
    } catch (e) {
      return e;
    }
  }
}
