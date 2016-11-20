const Sequelize = require('sequelize');

const config = require('../config.json');

module.exports = () => {
    const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
        host: config.database.address,
        dialect: 'mariadb',
        logging: false,

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });

    const Notification = sequelize.define('notification', {
        id      : { type: Sequelize.INTEGER,     primaryKey: true },
        package : { type: Sequelize.STRING(255), primaryKey: true },
        time    : { type: Sequelize.BIGINT(20) },
        title   : { type: Sequelize.STRING(500) },
        text    : { type: Sequelize.TEXT }
    });

    Notification.sync();

    function getNotifications() {
        return Notification.findAll();
    }

    return {
        getNotifications: getNotifications
    }
}