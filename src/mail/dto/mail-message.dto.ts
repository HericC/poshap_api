export interface MailMessage {
  to: string;
  subject: string;
  template: string;
  context: any;
}
