const Sequelize = require("sequelize");

const db = require('../config/database');

const Loket = db.define('layanan', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: {
            msg: "Nama layanan telah terdaftar!"
        },
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    kategoriId: {
        type: Sequelize.INTEGER(3),
        allowNull: false
    },
    kodeAntrian: {
        type: Sequelize.STRING(1),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    }
});

// (async () => {
//     await db.sync({alter: true});
// })();

module.exports = Loket;