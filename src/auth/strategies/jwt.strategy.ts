import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'users/users.service';

/**
 * JWT authentication strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    // Check for required environment variables
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN', '1d');
    
    // Initialize passport strategy with configuration
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Let Passport handle token expiration
      secretOrKey: jwtSecret,
      passReqToCallback: false, 
    });
    console.log(`JWT Strategy initialized with expiration: ${jwtExpiresIn}`);
    
    // Log error for missing JWT_SECRET if we got here somehow
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
    }
  }
  
  /**
   * Validate the JWT payload and return the user
   * @param payload - The decoded JWT payload
   * @returns The user object to be attached to the request
   * @throws UnauthorizedException if user not found or inactive
   */
  async validate(payload: any): Promise<any> {
    try {
      // Extract user information from JWT payload
      const { email, sub, userRole, userId } = payload;
      
      if (!email) {
        console.warn('JWT payload missing email field');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Find user by email
      const user = await this.usersService.findByEmail(payload.email);
      
      // Validate user exists and is active
      if (!user) {
        console.warn(`User with email ${email} not found during JWT validation`);
        throw new UnauthorizedException('User not found');
      }
      
      if (user.isActive === false) {
        console.warn(`Inactive user ${email} attempted authentication`);
        throw new UnauthorizedException('User account is inactive');
      }

      // Add JWT metadata to user object
      return {
        ...user,
        jwtPayload: {
          userRole,
          userId,
          sub,
          email,
        }
      };
    } catch (error) {
      console.error(`JWT validation error: ${error.message}`);
      throw new UnauthorizedException('Invalid authentication credentials');
    }
  }
}