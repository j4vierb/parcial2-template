import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BaseService } from './base.service';
import { ExampleEntity } from './example.entity';

@Controller('base')
@UseInterceptors(BusinessErrorsInterceptor)
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  async getAll(): Promise<ExampleEntity[]> {
    return this.baseService.findAll();
  }
}
