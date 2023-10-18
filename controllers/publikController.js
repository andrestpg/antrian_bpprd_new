const Loket = require("../models/Loket");
const Antrian = require("../models/Antrian");
const Layanan = require("../models/Layanan");
const Kategori = require("../models/Kategori");
const { Op } = require("sequelize");
const { getActiveLoket, getLastAntrianbyLayanan } = require("../helper/antrianHelper");

const getLoket = async (kategoriArr) => {
    await Promise.all([
        Loket.belongsTo(Layanan),
        Layanan.belongsTo(Kategori)
    ]);
    let loketQuery = {
        order: [["noLoket", "ASC"]],
        include: Layanan,
    };
    if(typeof kategoriArr != 'undefined'){
        loketQuery = {
            order: [["noLoket", "ASC"]],
            include: {
                model:Layanan,
                include: {
                    model: Kategori,
                    where: {
                        id: {
                            [Op.in] : kategoriArr
                        }
                    },
                    order: ['id', 'ASC']
                }
            },
        };
    }
    const loket = await Loket.findAll(loketQuery);
    return loket;
};

module.exports.index = async (req, res) => {
    try {
        const kategoriLokets = [1,2,3,4]
        const allLokets = await getLoket()
        const lokets = allLokets.filter( it => kategoriLokets.includes(it.layanan.kategoriId))
        const banks = allLokets.filter( it => it.layanan.kategoriId === 5)
        res.render("./public/index", {
            lokets,
            banks,
            script: "home",
            title: "Status Antrian",
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("500");
    }
};

module.exports.tiket = async (req, res) => {
    try {
        await Layanan.hasMany(Loket);
        await Kategori.hasMany(Layanan);
        const kategoris = await Kategori.findAll({
            include: {
                model: Layanan,
                as: "layanans",
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                                (SELECT COUNT(*) FROM lokets WHERE layananId = \`layanans\`.\`id\`)
                            `),
                            'jumlahLoket',
                        ],
                    ],
                },
                include: [
                    {
                        model: Loket,
                        attributes: [],
                    },
                ],
            },
        });
        // res.json(kategoris)
        res.render('./public/daftar', {
            kategoris,
            nl2br: require('nl2br'),
            script: 'tiket',
            title: 'Pengambilan Tiket Antrian'
        })
    } catch (err) {
        console.log(err);
        res.status(500).render("500");
    }
};

module.exports.daftar_antrian = async (req, res) => {
    try {
        let noAntrian = 1;
        const { layananId } = req.params;
        const layanan = await Layanan.findOne({ where: { id: layananId } });
        const loket = await getActiveLoket(layananId);
        if (loket) {
            const last = await getLastAntrianbyLayanan(layananId);

            if (last) {
                noAntrian = last.noAntrian + 1;
            }

            let result = await Antrian.create({
                layananId,
                noAntrian: noAntrian,
            });

            res.json({
                status: 1,
                noAntrian: noAntrian,
                kodeAntrian: layanan.kodeAntrian,
            });
        } else {
            res.json({
                status: 0,
                msg: "Loket tidak tersedia!",
            });
        }
    } catch (err) {
        console.log(err);
        let msg = "Terjadi kesalahan di server!";
        res.json({
            status: 0,
            msg,
        });
    }
};

module.exports.next_antrian = async (req, res) => {
    const layananId = req.params.layananId;
    const loketId = req.params.loketId;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 0, 0, 0);
    try {
        const antrian = await Antrian.findOne({
            where: {
                layananId,
                createdAt: {
                    [Op.gt]: todayStart,
                    [Op.lt]: todayEnd,
                },
                called: 0
            },
            order: [["noAntrian", "asc"]]
        });
        if (antrian) {
            try {
                await Promise.all([
                    Antrian.update(
                        {
                            called: 1
                        },
                        {
                            where: {
                                id: antrian.id
                            }
                        }
                    ),
                    Loket.update(
                        {
                            lastAntrian: antrian.noAntrian
                        }, 
                        {
                            where: {id: loketId}
                        }
                    )
                ]);
                res.json({
                    status: 1,
                    noAntrian: antrian.noAntrian,
                });
            } catch (err) {
                console.log("UPDATE ON NEXT ANTRIAN ERROR: ", err);
            }
        } else {
            res.json({
                status: 0,
                msg: "Tidak ada antrian selanjutnya!",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 0,
            msg: "Terjadi kesalahan di server!",
        });
    }
};