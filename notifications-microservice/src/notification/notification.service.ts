import { Injectable } from '@nestjs/common';
import { MailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailService: MailService) {}

  async sendOrderEmail(email: string, orderDetails: any) {
    await this.mailService.sendOrderConfirmation(email, orderDetails);
    return { message: 'Order email sent successfully' };
  }

  async sendWelcome(email: string) {
    await this.mailService.sendWelcomeEmail(email);
    return { message: 'Welcome email sent successfully' };
  }

  async sendPasswordReset(email: string, token: string) {
    await this.mailService.sendPasswordReset(email, token);
    return { message: 'Password reset email sent successfully' };
  }
}
