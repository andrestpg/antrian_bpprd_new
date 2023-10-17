const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login_get = (req, res) => {
    res.render('admin/auth/login', {
        title: "login",
        validation : "authValidation.js", 
        script : "auth.js" 
    });
}
 
module.exports.login_post = async (req, res) => {

    const {username, password, saveDevice} = req.body;
    try{
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if(user){
            const auth = await bcrypt.compare(password,user.password);
            if(auth){
                const token = await createToken(user.id);
                let cookieConfig = { httpOnly:true };
                saveDevice == 1 && (cookieConfig = {httpOnly: true, maxAge: process.env.TOKEN_EXPIRE * 1000 });

                let resJSON = {
                    status: 1,
                    msg: "Autentikasi berhasil!"
                };

                user.role == 0 && (resJSON['redirectURL'] = 'antrian');
                user.role == 3 && (resJSON['redirectURL'] = 'caller');
                res.cookie("authToken", token, cookieConfig );
                res.json(resJSON); 
            }else{
                res.json({
                    status: 0,
                    msg: "Password tidak benar!"
                });
            }
        }else{
            res.json({
                status: 0,
                msg: "Username tidak terdaftar!"
            });
        }
    }catch(err){
        console.log(err);
    }
}

module.exports.logout = (req, res) => {
    res.cookie('authToken','',{maxAge: 1});
    res.redirect('/auth');
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE * 1
    });
}
 