import { ApiProperty } from '@nestjs/swagger';

export class CreateBotDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  proxy: string;
}

export class UpdateBotDto {
  @ApiProperty()
  newPassword?: string;
  @ApiProperty({
    default: false,
  })
  resetSession: boolean;
}
