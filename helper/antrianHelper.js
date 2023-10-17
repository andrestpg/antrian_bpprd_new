const Loket = require('../models/Loket');
const Antrian = require('../models/Antrian');
const Layanan = require('../models/Layanan');

module.exports.getActiveLoket = async (layananId) => {
    try{
        let dataAntrian = await Loket.findAll({
            attributes: [
                'id',
                'noLoket',
            ],
            where: {
                layananId,
                status: 1
            },
            raw: true
        })

        if(dataAntrian){
            dataAntrian = dataAntrian.sort((a,b) => a.jumlahAntrian - b.jumlahAntrian)
        }

        return dataAntrian[0];
    }catch(err){
        throw err
    }
}

module.exports.getTotalAntrianbyLayanan = async (layananId) => {
    try{
        await Loket.hasMany(Antrian)
        const result = await Loket.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('antrians.id')), 'jumlahAntrian']
            ],
            include: [
                {
                    model: Antrian,
                    attributes: []
                }
            ],
            where: {
                layananId
            },
            raw:true
        })
        return result[0]
    }catch(err){
        throw err
    }

}

module.exports.getLastAntrianbyLayanan = async (layananId) => {
    try{
        const {Op} = require('sequelize');
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 0, 0, 0);
        const {kategoriId} = await Layanan.findOne({where: {id: layananId}});
        await Promise.all([
            Antrian.belongsTo(Layanan)
        ])
        const result = await Antrian.findOne({
            include: {
                model:Layanan,
                where: {
                    kategoriId
                }
            },
            where: {
                createdAt: {
                    [Op.gt]: todayStart,
                    [Op.lt]: todayEnd,
                }
            },
            order: [
                ['createdAt', 'DESC'],
                ['noAntrian', 'DESC']
            ]
        })
        return result
    }catch(err){
        throw err
    }

}
