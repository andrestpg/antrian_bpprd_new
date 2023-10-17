const Sequelize = require("sequelize");

const db = require('../config/database');

const Antrian = db.define('kategori_caller', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    kategoriId: {
        type: Sequelize.INTEGER(11),
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

module.exports = Antrian;