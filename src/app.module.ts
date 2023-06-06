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

const throttlerGuard = { provide: APP_GUARD, useClass: ThrottlerGuard };

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    UsersModule,
    AuthModule,
    ServicesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, throttlerGuard],
})
export class AppModule {}
