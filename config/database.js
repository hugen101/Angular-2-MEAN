const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/mean-angular-2',
    //uri: 'mongodb://hugenmatt:Random101@ds119660.mlab.com:19660/angularapp', //production
    secret: crypto,
    db: 'angularapp' //db name
}