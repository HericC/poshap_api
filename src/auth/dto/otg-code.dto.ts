import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OtgCodeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'É necessário informar o código.' })
  otgCode: string;
}
