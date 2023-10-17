const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../config/database');

const requireAuth = (req, res, next) => {
    const token = req.cookies.authToken;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err){
                console.log(err);
                res.redirect('/auth');
            }else{
                // console.log(decodedToken);
                res.locals.baseUrl = "http://localhost:8888/"
                next();
            }
        });

    }else{
        res.redirect('/auth');
    }
}

const adminOnly = (req, res, next) => {
    const token = req.cookies.authToken;
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if(err){
                res.locals.userLogin = null;
                next();
            }else{
                let user = await User.findOne({
                    where: {
                        id: decodedToken.id,
                        role: 1
                    }
                });
                if(user){
                    next()
                }else{
                    res.status(404).render('404')
                }
            }
        });
    }else{
        res.status(404).render('404')
    }
}

const callerOnly = (req, res, next) => {
    const token = req.cookies.authToken;
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if(err){
                res.locals.userLogin = null;
                next();
            }else{
                let user = await User.findOne({
                    where: {
                        id: decodedToken.id,
                        role: 3
                    }
                });
                if(user){
                    next()
                }else{
                    res.status(404).render('404')
                }
            }
        });
    }else{
        res.status(404).render('404')
    }
}

const checkUser = async (req, res, next) => {
    try{
        const conn = await checkDbConn();
        if(conn){
            const token = req.cookies.authToken;
            res.locals.userRole = "Admin";
        
            if(token){
                jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
                    if(err){
                        res.locals.userLogin = null;
                        next();
                    }else{
                        let user = await User.findOne({
                            where: {
                                id: decodedToken.id
                            }
                        });
    
                        res.locals.userLogin = user;
                        next();
                    }
                });
            }else{
                res.locals.userLogin = null;
                next();
            }
        }else{
            res.status(500).render('500', {title: "500"});
        }
    }catch(err){
        res.status(500).render('500', {title: "500"});
    }
}

const checkUserLogin = (req, res, next) => {
    const token = req.cookies.authToken;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err){
                console.log(err);
                next();
            }else{
                console.log(decodedToken);
                res.locals.baseUrl = "http://localhost:8888/"
                res.redirect('/users');
            }
        });

    }else{
        next()
    }
}

const checkDbConn = async () => {
    try{
        await sequelize.authenticate();
        return 1;
    }catch(err){
        console.log(err);
        return 0;
    }
}

module.exports = {requireAuth, checkUser, checkUserLogin, adminOnly};