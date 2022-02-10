import { ApiProperty } from '@nestjs/swagger';

export class CreateBotDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  proxy: string;
  @ApiProperty()
  hasError: boolean;
  @ApiProperty()
  session?: string;
}
