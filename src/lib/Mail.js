import nodeMailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail{ 
  constructor(){
    const {host, port, secure, auth } = mailConfig

    this.transporter = nodeMailer.createTransport({
      host, port, secure, auth: auth.user ? auth : null
    });
  }

  sendMail(message){
    return this.transporter.sendMail({
      ...mailConfig,
      ...message,
    });
  }
}

export default new Mail();