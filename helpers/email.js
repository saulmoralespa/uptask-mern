import nodemailer from "nodemailer";

export const emailRegister = async ({email, name, token}) => {
   
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "UpTask - Comprueba tu cuenta",
        html: `
            <p>Hola: ${name} comprueba tu cuenta en UpTask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

        `
    });
};

export const emailLostPassword = async ({email, name, token}) => {
   
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com',
        to: email,
        subject: "UpTask - Reestablece tu password",
        text: "UpTask - Reestablece tu password",
        html: `
            <p>Hola: ${name} has solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo password: 
                <a href="${process.env.FRONTEND_URL}/lost-password/${token}">Reestablecer Password</a>
            </p>
            <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>

        `
    });
};