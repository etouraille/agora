const SibApiV3Sdk = require("sib-api-v3-sdk");
const config = require("../config");
const sendEmail = ( to, name, subject, template, params ) => {

    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = config.sendinblueApiKey;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = template;
    sendSmtpEmail.sender = {"name":"Queel.fr","email":"contact@queel.fr"};
    sendSmtpEmail.to = [{"email":to ,"name": name}];
    //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
    //sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
    //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
    //sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
    sendSmtpEmail.params = params;

    return apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = {
    sendEmail,
}