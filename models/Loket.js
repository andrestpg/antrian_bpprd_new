const Sequelize = require("sequelize");

const db = require('../config/database');

const Loket = db.define('loket', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    noLoket: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        unique: {
            msg: "No loket telah terdaftar!"
        },
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    userId: {
        type: Sequelize.INTEGER(11),
        unique: {
            msg: "Admin telah terdaftar!"
        },
    },
    layananId: Sequelize.INTEGER(11),
    status: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1
    },
    lastAntrian: Sequelize.STRING(10),
    lastUpdate: Sequelize.DATE,
});

// (async () => {
//     await db.sync({alter: true});
// })();

module.exports = Loket;