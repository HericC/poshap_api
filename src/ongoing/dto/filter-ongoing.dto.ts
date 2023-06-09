import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum Status {
  ongoing = 'ongoing',
  finished = 'finished',
  canceled = 'canceled',
}

export class FilterOngoingDto {
  @ApiProperty({
    required: false,
    description: 'status',
    enum: ['ongoing', 'finished', 'canceled'],
  })
  @IsOptional()
  status: Status;
}
