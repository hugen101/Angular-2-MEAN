const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if(email.length < 5 || email.length >30) {
            return false;
        } else {
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
}

let validUserName = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

let validPassword = (password) => {
    if(!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}$/);
        return regExp.test(password);
    }
}

const passwordValidators = [
    {
        validator: validPassword,
        message: 'password must be at least 8 characters long and at most 15 characters, and have at least 1 letter, 1 number, and 1 special character.'
    }
]

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 but no more than 15'
    },
    {
        validator: validUserName,
        message: 'Username must not have special characters'
    }
]

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 characters but no more than 30'
    },{
        validator: validEmailChecker,
        message: 'must be a valid e-mail'
    }
];



const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators },
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))
    return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', userSchema);