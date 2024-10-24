import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = request.headers.authorization?.split(' ')[1];



    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret});

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);
      
      if(user.isAdmin){
        user.roles = ['admin']
      }else {
        user.roles = ['user'];
      }


      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

  }
}
