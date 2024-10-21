import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'carlosmeyer528@gmail.com',
        pass: 'etoq ssof sfer mhka',
      },
    });}
    async sendMail(userData: SendEmailDto, code: string): Promise<void> {
      const mailOptions: nodemailer.SendMailOptions = {
        from: '"Dental Crown"',
        to: userData.to,
        subject: 'Código de Acceso para Dental Crown',
        html: `
          <img src="https://github.com/CarlosMeyer400400/Cifrado-de-Transposici-n-en-Vue-y-la-libreria-crypto-js/blob/main/logosinfondo.png?raw=true" alt="Dental Crown Logo" width="150">
          <h1>¡Bienvenido a Dental Crown!</h1>
          <p>Hola,</p>
          <p>Aquí tienes tu código de acceso único:</p>
          <h2 style="background-color: #f0f0f0; padding: 10px;">${code}</h2>
          <p>Por favor, asegúrate de utilizar este código dentro de los próximos 3 minutos.</p>
          <p>Si tú no has intentado recuperar tu contraseña ignora este correo.</p>
          <p>Gracias por confiar en Dental Crown para tus necesidades dentales.</p>
          <p>Atentamente,<br>El equipo de Dental Crown</p>
        `,
      };
    
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    }
    
    

    generateCode():string{
        const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codigo = '';

        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indiceAleatorio);
        }

        return codigo;
    }
  
}
