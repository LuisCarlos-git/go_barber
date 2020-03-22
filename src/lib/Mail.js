import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transpoter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(massage) {
    this.transpoter.sendMail({
      ...mailConfig.default,
      ...massage,
    });
  }
}

export default new Mail();
