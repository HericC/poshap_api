import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

enum Status {
  ongoing = 'ongoing',
  finished = 'finished',
  canceled = 'canceled',
}

export class FilterOngoingDto {
  @ApiProperty({
    required: false,
    description: 'status',
    enum: Status,
  })
  @IsOptional()
  status: Status;
}
