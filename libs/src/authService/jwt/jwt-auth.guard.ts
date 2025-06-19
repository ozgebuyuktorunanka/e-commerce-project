import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

 // This guard is used to protect routes that require authentication
 // This guard acts as a security checkpoint for your routes

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
 
    //This method is called before accessing any protected route
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    //This method handles what happens after token validation
    handleRequest(err, user, info){
        if( err || !user){
            throw err || new UnauthorizedException('Authentication failed.');
        }
        return user;
    }
}




/**
 * USAGE EXAMPLE:
 *  @UseGuards(JwtAuthGuard)
   @Get('profile')
   getProfile(@Request() req) {
       return req.user;
   }
 */