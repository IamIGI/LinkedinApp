import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import {
  Observable,
  from,
  map,
  switchMap,
  tap,
  pipe,
  catchError,
  of,
} from 'rxjs';
import { User } from '../models/user.class';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { authCode } from '../dictionaries/auth-dictionaries';
import { UserNotificationsEntity } from '../models/user-notifications.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserNotificationsEntity)
    private readonly userNotificationRepository: Repository<UserNotificationsEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12)); //convert promise to observable
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          role: true,
          isPrivateAccount: true,
          company: true,
          position: true,
          education: true,
          subscribers: true,
          profileImagePath: true,
          backgroundImagePath: true,
        },
        where: { email },
      }),
    ).pipe(
      map((user: User) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, ...authCode.emailNoExists },
            HttpStatus.NOT_FOUND,
          );
        }
        return user;
      }),
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (!isValidPassword) {
              throw new HttpException(
                { status: HttpStatus.NOT_FOUND, ...authCode.badPassword },
                HttpStatus.NOT_FOUND,
              );
            }
            delete user.password;
            return user;
          }),
        ),
      ),
    );
  }

  registerAccount(user: User): Observable<string> {
    const { firstName, lastName, email, password, isPrivateAccount } = user;

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.userRepository
            .save({
              firstName,
              lastName,
              email,
              password: hashedPassword,
              isPrivateAccount,
              subscribers: !isPrivateAccount ? 0 : null,
            })
            .catch((error) => {
              if (/(email)[\s\S]+(already exists)/.test(error.detail)) {
                throw new HttpException(
                  authCode.emailAlreadyTaken,
                  HttpStatus.NOT_FOUND,
                );
              }
            }),
        ).pipe(
          map((user: UserEntity) => {
            this.userNotificationRepository.save({ user: user });
          }),
          switchMap(() => {
            return from(
              this.validateUser(email, password).pipe(
                switchMap((user: User) => {
                  if (user) {
                    //create JWT - credentials
                    return from(this.jwtService.signAsync({ user }));
                  }
                }),
              ),
            );
          }),
        );
      }),
    );
  }

  login(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          //create JWT - credentials
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError((err) => {
        return of(null);
      }),
    );
  }
}
