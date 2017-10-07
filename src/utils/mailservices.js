const apikey = 'key-ceaee4c93cf03f7f09b2eba297c44ab2';
const domain = 'mg.qyudelivery.com';
const mailgun = require('mailgun-js')({apiKey: apikey, domain: domain});
const generator          = require('generate-password'); 

const data = {
  from: 'Art Burger <artburger@mg.qyudelivery.com>',
  subject: 'qyudelivery - Recuperar senha',
};

exports.sendRecoverCode = (emailReceiver)=>{
    const recoverCode = generator.generate({
      length: 6,
      numbers: true
    });
    data.html = 'Copie e cole no app esse código de recuperação: '+ recoverCode;

    data.to = emailReceiver;
    return new Promise((resolve, reject)=>{
      mailgun.messages().send(data, (err, info)=>{
        if(err)
          reject({message: err, code: 400})
        else
          resolve({data: {feedback: 'Your reset email was send', recoverCode: recoverCode}, code: 200});
      });
    })
}