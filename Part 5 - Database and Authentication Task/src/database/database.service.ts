import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  async query(text: string, params?: any[]) {
    const client = new Client({
      user: this.configService.get<string>('DB_USERNAME'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_NAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: 5432,
    });

    await client.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  }
}