import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServer() {
    return { message: 'Server is working!' };
  }
}
