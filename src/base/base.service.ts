import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExampleEntity } from './example.entity';

@Injectable()
export class BaseService {
  @InjectRepository(ExampleEntity)
  private readonly baseRepository: Repository<ExampleEntity>;

  async findAll(): Promise<ExampleEntity[]> {
    return this.baseRepository.find();
  }
}
