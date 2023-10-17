const Loket = require('../models/Loket');
const Layanan = require('../models/Layanan');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {Op} = require('sequelize');

module.exports.index = async (req, res) => {
    staffs = await getNotRegistered();
    layanans = await Layanan.findAll();
    res.render('admin/loket/index', {
        title: "Data Loket",
        validation: "loketValidation.js",
        script: "loket.js",
        staffs: staffs
    });
}

module.exports.get = async (req, res) => {
    try{
        await Loket.belongsTo(Layanan);
        await Loket.belongsTo(User, {
            foreignKey: {
                allowNull: true
            }
        });
        let data = await Loket.findAll({
            order: [
                ['noLoket', 'ASC']
            ],
            include: [User, Layanan]
        });
        res.json(data);
    }catch(err){
        console.log(err);
        res.json({
            status: 0,
            message: "Terjadi kesalahan di server!"
        });
    }
}

module.exports.get_one = async (req, res) => {
    const id = req.params.id;
    try{
        await Loket.belongsTo(Layanan);
        await Loket.belongsTo(User);
        let data = await Loket.findOne({
            where: {
                id: id
            },
            order: [
                ['noLoket', 'ASC']
            ],
            include: [User, Layanan]
        });
        res.json(data);
    }catch(err){
        console.log(err);
        res.json({
            status: 0,
            message: "Terjadi kesalahan di server!"
        });
    }
}

module.exports.get_not_registered = async (req, res) => {
    let data = await getNotRegistered();
    res.json(data);
}

const getNotRegistered = async () => {
    await User.hasOne(Loket);
    let data = await User.findAll({
        where: {
            role:0,
            [Op.or]: {
                '$loket.userId$': null
            }
        },
        include: {
            model: Loket,
            required: false,
        }
    });
    return data;
}

module.exports.add = async (req, res) => {
    const {noLoket,user, layananId} = req.body;
    if(res.locals.userLogin.role === 1){
        try{
            await Loket.create({
                userId:user,
                noLoket,
                layananId,
            });
            res.json({
                status:1,
                resId: Loket.id
            });
        }catch(err){
            console.log(err)
            res.status(500).json({
                status: 0,
                message: "Gagal menyimpan data",
                desc: 'Terjadi kesalahan diserver!',
            });
        }
    }
}
 
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const {noLoket,user, layananId} = req.body;

    if(res.locals.userLogin.role === 1){
        try{
            await Loket.update({
                userId:user,
                noLoket,
                layananId,
            },{
                where: {
                    id: id
                }
            });
            res.json({status:1});
        }catch(err){
            console.log(err);
            res.status(500).json({
                status: 0,
                msg: err['errors'][0]['message'],
            });
        }
    }else{
        res.send("Anda tidak memiliki akses!");
    }

}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    
    if(res.locals.userLogin.role === 1){
        try{
            await Loket.destroy({
                where: {
                    id: id
                }
            });
            res.json({status:1});
        }catch(err){
            res.json({
                status: 0,
                message: "gagal menghapus data"
            });
        }
    }else{
        res.send("Anda tidak memiliki akses!");
    }
}
