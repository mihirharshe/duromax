const fs = require('fs');
const { join } = require('path');
const { getDeficitRMs } = require('./rawMaterial.controller');
const { getDeficitBuckets } = require('./bucket.controller');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const getEmailTemplateContent = async (template, context) => {
    return new Promise((resolve) => {
        template = template.replace(/(\r\n|\n|\r|\t)/g, "");
        resolve(handlebars.compile(template, { noEscape: true })(context));
    });
}

const sendRMandBktsEmail = async () => {
    try {
        const deficitRMs = await getDeficitRMs();
        const deficitBkts = await getDeficitBuckets();

        const templateHtml = fs.readFileSync(join(__dirname, '../templates/quantity-alert.html')).toString();

        const data = {
            deficitRawMaterials: deficitRMs,
            deficitBuckets: deficitBkts,
        };

        const htmlBody = await getEmailTemplateContent(templateHtml, data);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_EMAILID,
                pass: process.env.MAIL_PASSWORD
            }
        });
        
        const mailOpts = {
            from: process.env.MAIL_EMAILID,
            to: ['sanjay@duromax.in', 'sushant@duromax.in', 'shishir@duromax.in', 'support@duromax.in', 'brijendrashankdhar@gmail.com', 'mihir.harshe12@gmail.com'],
            subject: 'Raw Materials and Buckets Quantity Update',
            html: htmlBody
        };

        transporter.sendMail(mailOpts, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info.response);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { sendRMandBktsEmail }