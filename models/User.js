const Sequelize = require("sequelize");

const db = require('../config/database');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    role: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
    username: {
        type: Sequelize.STRING(20),
        unique: {
            msg: "Username telah terdaftar!"
        },
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
        }
    },
});


// (async () => {
//     await db.sync({alter: true});
// })();

module.exports = User;