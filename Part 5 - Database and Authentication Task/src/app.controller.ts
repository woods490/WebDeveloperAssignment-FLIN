import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private databaseService: DatabaseService
  ) {}

  @Post('register')
  async createUser(@Body() body) {
    try {
      if (typeof body.username !== 'string' || typeof body.password !== 'string') {
        throw new Error('Validasi gagal: username dan password harus string!');
      }

      const user = await this.appService.register(body.username, body.password);
      const username = user.rows[0].username;

      return {
        status: HttpStatus.CREATED,
        message: 'User berhasil dibuat!',
        data: username
      }
    } catch (error) {
      throw new HttpException(
          { status: error.status || HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async loginUser(@Body() body) {
    try {
      if (typeof body.username !== 'string' || typeof body.password !== 'string') {
        throw new Error('Validasi gagal: username dan password harus string!');
      }

      const user = await this.appService.validateUser(body.username, body.password);
      if (!user) {
        throw new UnauthorizedException('Username / password salah.');
      }

      const payload = await this.appService.login(user.rows[0].username, user.rows[0].user_id);
      if (!payload || !payload.access_token) {
        throw new InternalServerErrorException('Gagal melakukan autentikasi.');
      }

      const { access_token } = payload;
      const { uuid, username: userUsername } = user;

      return {
        status: HttpStatus.CREATED,
        message: 'User berhasil login!',
        data: {
            uuid,
            username: userUsername,
            access_token
        }
      }
    } catch (error) {
      throw new HttpException(
          { status: error.status || HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUser(@Body() body) {
    try {
      if (typeof body.username !== 'string') {
        throw new Error('Validasi gagal: username harus string!');
      }

      const data = await this.databaseService.query("SELECT * FROM users WHERE username = $1", [body.username]);

      if (data.rows[0].length == 0) {
        throw new NotFoundException('Username tidak ditemukan');
      }

      return {
        status: HttpStatus.OK,
        message: 'Profile user berhasil ditemukan!',
        data: data.rows[0].username
      }
    } catch (error) {
      throw new HttpException(
          { status: error.status || HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
