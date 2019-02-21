import {
  Controller,
  FileInterceptor,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('upload_file'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
    return { id: '1', name: file.originalname };
  }
}
