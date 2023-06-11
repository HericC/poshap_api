import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailMessage } from './dto/mail-message.dto';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

@Injectable()
export class MailService {
  private transport: any;

  constructor(private readonly config: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: +config.get('MAIL_PORT'),
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
    });

    this.transport.use(
      'compile',
      hbs({
        viewEngine: { defaultLayout: undefined },
        viewPath: path.resolve('./src/mail/templates/'),
        extName: '.hbs',
      }),
    );
  }

  async sendMail(message: MailMessage) {
    if (!this.transport) return;

    return this.transport.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: message.to,
      subject: message.subject,
      template: message.template,
      context: message.context,
    });
  }
}
