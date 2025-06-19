import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('order-confirmation')
  @ApiOperation({ summary: 'Send Order Confirmation Email' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        order: {
          orderId: '12345',
          totalPrice: 99.99,
          items: [
            { productId: 'abc123', quantity: 2 },
            { productId: 'def456', quantity: 1 },
          ],
        },
      },
    },
  })
  async sendOrderEmail(
    @Body('email') email: string,
    @Body('order') order: any,
  ) {
    return this.notificationsService.sendOrderEmail(email, order);
  }

  @Post('welcome')
  @ApiOperation({ summary: 'Send Welcome Email' })
  async sendWelcome(@Body('email') email: string) {
    return this.notificationsService.sendWelcome(email);
  }

  @Post('password-reset')
  @ApiOperation({ summary: 'Send Password Reset Email' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        token: 'reset-token-123456',
      },
    },
  })
  async sendReset(@Body('email') email: string, @Body('token') token: string) {
    return this.notificationsService.sendPasswordReset(email, token);
  }
}
