const moment = require('moment');

const generateUID = () => {
    let IDDate = moment().format('YYMMDD'); //230124
    let IDRandom = Math.floor(100000 + Math.random() * 900000);

    let finalID = `${IDDate}${IDRandom}`;

    return finalID;
}

module.exports = { generateUID }
