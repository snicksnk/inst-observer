import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { session } from './data/session';
import { getUserStory } from './utils/ig-requests/getStory';
import { restoreState } from './utils/ig-requests/restoreState';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user/:targetUser/story')
  @ApiParam({ name: 'targetUser', required: true })
  async getHello(@Param('targetUser') targetUser) {
    return await this.appService.getUserStory(targetUser);
  }

  // @Get('auth/session')
  // @ApiParam({ name: 'targetUser', required: true })
  // async getSession(@Param('targetUser') targetUser) {
  //   const ig = await this.appService.getBot({
  //     username: 'ip_storozhev_yz',
  //     password: 'ToPvuR9z8H',
  //     proxy: 'http://Lrp7e3qE:vHcHa6xx@194.226.184.45:64723',
  //   });

  //   const state = JSON.stringify(ig.state);
  //   return state;
  // }

  @Get('debug-story/:targetUser')
  @ApiParam({ name: 'targetUser', required: true })
  async getStory(@Param('targetUser') targetUser) {
    const ig = await restoreState(JSON.stringify(session));
    return await getUserStory(ig, targetUser);
  }
}
