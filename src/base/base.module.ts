import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleEntity } from './example.entity';
import { BaseController } from './base.controller';

@Module({
  providers: [BaseService],
  imports: [TypeOrmModule.forFeature([ExampleEntity])],
  controllers: [BaseController],
})
export class BaseModule {}
