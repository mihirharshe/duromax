var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const corsOptions = require('./config/corsOptions');
const dbConfig = require('./config/database');
dbConfig();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { sendRMandBktsEmail } = require('./controllers/emailUpdates');
const cron = require('node-cron')

var app = express();
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));


app.listen(PORT, () => {
    console.log("Server running on port "+ PORT);
});

app.use('/api/v1', indexRouter);

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

try {
    cron.schedule('30 2 * * 1,4', async () => { // 0mins, 8hrs -> (8:00AM), any day of the month, any month, Monday & Thursday
        await sendRMandBktsEmail();
    }).start();
}
catch (err) {
    console.log(`Error setting up cron job: `, err);
}


module.exports = app;
