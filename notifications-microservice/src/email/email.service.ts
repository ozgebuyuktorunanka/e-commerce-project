import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplate } from './templates';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendOrderConfirmation(userEmail: string, orderDetails: any): Promise<void> {
    const { orderId, totalPrice, items } = orderDetails;

    await this.mailerService.sendMail({
      to: userEmail,
      subject: `Order Confirmation - #${orderId}`,
      template: EmailTemplate.ORDER_CONFIRMATION,
      context: {
        orderId,
        totalPrice,
        items,
        date: new Date().toLocaleString(),
      },
    });
  }

  async sendWelcomeEmail(userEmail: string): Promise<void> {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome to Our App!',
      template: EmailTemplate.WELCOME,
      context: {
        email: userEmail,
      },
    });
  }

  async sendPasswordReset(userEmail: string, resetToken: string): Promise<void> {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Password Reset Request',
      template: EmailTemplate.PASSWORD_RESET,
      context: {
        resetToken,
        email: userEmail,
      },
    });
  }
}
