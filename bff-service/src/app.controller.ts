import {All, Controller, Header, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  @Header('content-type', 'application/json')
  async getHello(@Res() res: Response): Promise<void> {
    const result = await this.appService.getHello();
    res.status(result.status).json(result.data)
  }
}
