import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { OngoingModule } from './ongoing/ongoing.module';

const throttlerGuard = { provide: APP_GUARD, useClass: ThrottlerGuard };
const ttl = +process.env.THROTTLER_TTL || 60;
const limit = +process.env.THROTTLER_LIMIT || 10;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot({ ttl, limit }),
    UsersModule,
    AuthModule,
    ServicesModule,
    OrdersModule,
    OngoingModule,
  ],
  controllers: [AppController],
  providers: [AppService, throttlerGuard],
})
export class AppModule {}
