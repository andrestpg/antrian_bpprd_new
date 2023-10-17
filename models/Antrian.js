const Sequelize = require("sequelize");

const db = require('../config/database');

const Antrian = db.define('antrian', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    noAntrian: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    layananId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    called: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0
    }
});

// (async () => {
//     await db.sync({alter: true});
// })();

module.exports = Antrian;