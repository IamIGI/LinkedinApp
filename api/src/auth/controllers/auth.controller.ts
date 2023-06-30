import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../models/user.class';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<{ token: string }> {
    return this.authService
      .registerAccount(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }

  @Post('login')
  login(@Body() user: User): Observable<{ token: string }> {
    return this.authService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
