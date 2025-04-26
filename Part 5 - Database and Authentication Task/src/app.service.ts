import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AppService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService
  ) {}

  async register(username: string, password: string) {
    const users = await this.databaseService.query('SELECT COUNT(*) AS count FROM users WHERE username = $1', [username]);
    
    if(users.rows[0].count > 0) {
        throw new BadRequestException('Username sudah ada!');
    }

    try {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const encryptedPassword = salt + '.' + hash.toString('hex');
        const user = await this.databaseService.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
          [username, encryptedPassword],
        );

        return user;
    } catch (error) {
        throw new HttpException(
            error.message,
            error.status
        );
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.databaseService.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (user.rows.length === 0) {
      return null;
    }
    
    const [salt, storedHash] = user.rows[0].password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
        return null
    }

    return user
  }

  async login(username, user_id)
  {
    const payload = { username: username, sub: user_id }

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
