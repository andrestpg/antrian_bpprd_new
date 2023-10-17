const Sequelize = require("sequelize");

const db = require('../config/database');

const Loket = db.define('kategori', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: {
            msg: "Nama kategori telah terdaftar!"
        },
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    kodeAntrian: {
        type: Sequelize.STRING(1),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    keterangan: Sequelize.TEXT
});

// (async () => {
//     await db.sync({alter: true});
// })();

module.exports = Loket;