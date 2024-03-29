const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/User');

const userCtrl = {
    login: (req, res) => {
        res.render('login');
    },
    getFormRegister: (req, res) => {
        res.render('register');
    },
    processLogin: (req, res) => {
        const errors = validationResult(req);
        let userToLogin = User.findByField('email', req.body.email);
        console.log(userToLogin);
        return userToLogin && bcrypt.compareSync(req.body.password, userToLogin.password)
        ? (delete userToLogin.password, req.session.userLogged = userToLogin, req.body.remember && res.cookie('userEmail', req.body.email, { maxAge: 60000 }), res.redirect('/'))
        : res.render('login', { errors: errors.mapped(), oldData: req.body } );
    },
    register: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            let newUser = {
               ...req.body,
               password: bcrypt.hashSync(req.body.password, 12),
               photo: req.file ? req.file.filename : '',
            }; 

            delete newUser.confirmPassword;
            User.create(newUser);

            return res.redirect('/users/login');
        };

        return res.render('register',{errors: errors.mapped(), oldData: req.body});
    },
    profile: (req, res) => {
        return res.render('userProfile', { user: req.session.userLogged });
    },
    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        return res.redirect('/');
    },
    update: (req, res)=>{
        const errors = validationResult(req);

        if(errors.isEmpty()){
            let userUpdated = User.update(req.params.id, req.body);
            delete userUpdated.password;
            req.session.userLogged = userUpdated;
        }

        return res.render('userProfile', {errors: errors.mapped(), user: req.session.userLogged});
    },
    changePassword : (req, res)=>{
        const errors = validationResult(req);

        if(errors.isEmpty()){
            User.updatePassword(req.params.id, req.body.newPassword);
        };

        return res.render('userProfile', {errors: errors.mapped(), user: req.session.userLogged});
    }
}

module.exports = userCtrl;