const nodemailer = require('nodemailer');

// Configurar transporter con variables de entorno
function createTransporter() {
    return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER || 'tumail@gmail.com',
            pass: process.env.EMAIL_PASS || 'ocpd quim como suck'
        }
    });
}

function sendConfirmationEmail(email, verificationCode, options = {}) {
    const transporter = createTransporter();
    const { emailConsent = false, unsubscribeToken = '' } = options;
    
    // URL base del servidor (cambiar en producción)
    const baseUrl = process.env.BASE_URL || 'https://tu-app-render.onrender.com';
    const unsubscribeUrl = `${baseUrl}/api/auth/unsubscribe/${unsubscribeToken}`;

    let consentText = '';
    if (emailConsent) {
        consentText = `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #2e7d2e; margin: 0 0 10px 0;">✅ Gracias por suscribirte</h4>
                <p style="margin: 0; font-size: 14px;">Has aceptado recibir actualizaciones y noticias sobre Bingo Game. Prometemos enviarte solo contenido relevante y útil.</p>
            </div>
        `;
    } else {
        consentText = `
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #1e90ff; margin: 0 0 10px 0;">ℹ️ Solo emails esenciales</h4>
                <p style="margin: 0; font-size: 14px;">Solo recibirás emails relacionados con tu cuenta y partidas. No enviaremos actualizaciones promocionales.</p>
            </div>
        `;
    }

    let mailOptions = {
        from: '"Bingo Game" <' + (process.env.EMAIL_USER || 'hoblayerta@gmail.com') + '>',
        to: email,
        subject: 'Código de Verificación - Bingo Game',
        text: `Tu código de verificación es: ${verificationCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2196F3; text-align: center;">🎯 Bingo Game - Verificación de Cuenta</h2>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <h3>Tu código de verificación es:</h3>
                    <p style="font-size: 32px; color: #4CAF50; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">${verificationCode}</p>
                    <p>Ingresa este código en la aplicación para completar tu registro.</p>
                </div>

                ${consentText}

                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
                    <p><strong>Bingo Game</strong> - Plataforma de Bingo Multijugador</p>
                    <p>Este email contiene información importante sobre tu cuenta.</p>
                    ${emailConsent ? `<p><a href="${unsubscribeUrl}" style="color: #666;">Darse de baja de actualizaciones</a></p>` : ''}
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error al enviar el correo de verificación:', error.message);
            return false;
        } else {
            console.log('✅ Correo de verificación enviado:', info.response);
            return true;
        }
    });
}

function sendRoundCodeEmail(email, roundCode, password, emailConsent = false, unsubscribeToken = '') {
    const transporter = createTransporter();
    
    // URL base del servidor
    const baseUrl = process.env.BASE_URL || 'https://tu-app-render.onrender.com';
    const unsubscribeUrl = `${baseUrl}/api/auth/unsubscribe/${unsubscribeToken}`;

    let consentFooter = '';
    if (emailConsent) {
        consentFooter = `
            <div style="background-color: #e8f5e8; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px;">
                <p style="margin: 0; color: #2e7d2e;">✅ Estás suscrito a nuestras actualizaciones</p>
                <p style="margin: 5px 0 0 0;"><a href="${unsubscribeUrl}" style="color: #666; font-size: 11px;">Darse de baja de actualizaciones</a></p>
            </div>
        `;
    } else {
        consentFooter = `
            <div style="background-color: #f0f8ff; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px;">
                <p style="margin: 0; color: #1e90ff;">ℹ️ Solo recibes emails esenciales de tu cuenta</p>
            </div>
        `;
    }

    let mailOptions = {
        from: '"Bingo Game" <' + (process.env.EMAIL_USER || 'hoblayerta@gmail.com') + '>',
        to: email,
        subject: 'Tu Partida de Bingo ha sido Creada 🎯',
        text: `Tu partida de Bingo ha sido creada exitosamente.\n\nCódigo de Partida: ${roundCode}\nTu Contraseña: ${password}\n\nComparte el código ${roundCode} con los jugadores para que se unan a tu partida.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2196F3; text-align: center;">🎯 ¡Tu Partida de Bingo está Lista!</h2>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Detalles de tu Partida:</h3>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <p><strong>Código de Partida:</strong></p>
                        <p style="font-size: 28px; color: #4CAF50; font-weight: bold; letter-spacing: 3px; text-align: center; margin: 10px 0;">${roundCode}</p>
                    </div>
                    <p><strong>Tu Contraseña de Host:</strong> <code style="background: #e0e0e0; padding: 4px 8px; border-radius: 3px;">${password}</code></p>
                </div>
                
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin-top: 0; color: #1976d2;">📋 Información Importante:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Comparte el código <strong>${roundCode}</strong> con los jugadores</li>
                        <li>Máximo 50 jugadores por partida</li>
                        <li>Cada jugador tendrá un tablero de 3x3 único</li>
                        <li>Como host, podrás controlar el juego</li>
                        <li>Guarda tu contraseña para futuras sesiones</li>
                    </ul>
                </div>

                ${consentFooter}

                <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
                    <p><strong>Bingo Game</strong> - Plataforma de Bingo Multijugador</p>
                    <p>¡Que disfrutes tu partida de Bingo!</p>
                    <p style="margin-top: 10px;">Este email contiene información importante sobre tu partida.</p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error al enviar el correo del código de partida:', error.message);
            return false;
        } else {
            console.log(`✅ Correo de código de partida enviado a ${email}:`, info.response);
            return true;
        }
    });
}

// NUEVA FUNCIÓN: Enviar email de actualización (solo a usuarios con consentimiento)
function sendUpdateEmail(email, subject, content, unsubscribeToken) {
    const transporter = createTransporter();
    
    const baseUrl = process.env.BASE_URL || 'https://tu-app-render.onrender.com';
    const unsubscribeUrl = `${baseUrl}/api/auth/unsubscribe/${unsubscribeToken}`;

    let mailOptions = {
        from: '"Bingo Game - Actualizaciones" <' + (process.env.EMAIL_USER || 'hoblayerta@gmail.com') + '>',
        to: email,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2196F3;">🎯 Bingo Game - ${subject}</h2>
                
                ${content}

                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
                    <p><strong>Bingo Game</strong> - Actualizaciones</p>
                    <p>Recibes este email porque te suscribiste a nuestras actualizaciones.</p>
                    <p><a href="${unsubscribeUrl}" style="color: #666;">Darse de baja de actualizaciones</a></p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Error al enviar email de actualización:', error.message);
            return false;
        } else {
            console.log(`✅ Email de actualización enviado a ${email}:`, info.response);
            return true;
        }
    });
}

function testEmailConfiguration() {
    const transporter = createTransporter();
    
    return transporter.verify((error, success) => {
        if (error) {
            console.log('❌ Error en configuración de email:', error.message);
            return false;
        } else {
            console.log('✅ Servidor de email configurado correctamente');
            return true;
        }
    });
}

module.exports = {
    sendConfirmationEmail,
    sendRoundCodeEmail,
    sendUpdateEmail,
    testEmailConfiguration
};
