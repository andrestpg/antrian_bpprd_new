const Layanan = require('../models/Layanan');
const Kategori = require('../models/Kategori')

module.exports.index = async (req, res) => {
    const kategoris = await Kategori.findAll();
    res.render('admin/layanan/index', {
        title: "Data Layanan",
        validation: "layananValidation.js",
        script: "layanan.js",
        kategoris
    });
}

module.exports.get = async (req, res) => {
    try{
        await Layanan.belongsTo(Kategori)
        let data = await Layanan.findAll({
            include: [Kategori]
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
        let data = await Layanan.findOne({
            where: { id }
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

module.exports.add = async (req, res) => {
    const {nama, kategoriId} = req.body;
    if(res.locals.userLogin.role === 1){
        try{
            const kategori = await Kategori.findOne({
                where: {
                    id: kategoriId
                }
            });

            await Layanan.create({
                nama,
                kodeAntrian: kategori.kodeAntrian,
                kategoriId,
            });

            res.json({
                status:1,
                resId: Layanan.id
            });
        }catch(err){
            res.status(500).json({
                status: 0,
                message: "Gagal menyimpan data",
                desc: err['errors'][0]['message'],
            });
        }
    }
}
 
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const {nama, kategoriId} = req.body;

    if(res.locals.userLogin.role === 1){
        try{
            await Layanan.update({
                nama,
                kodeAntrian,
                kategoriId,
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