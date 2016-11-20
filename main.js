const app         = require('express')();
const server      = require('http').Server(app);
const io          = require('socket.io')(server);
const bodyParser  = require('body-parser');
const jwt         = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const Database = require('./libs/Database')();

const config = require('./config.json');

server.listen(config.server.port);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/dist/index.html');
});

app.post('/', (req, res) => {
    res.sendfile(__dirname + '/dist/index.html');
});

app.post('/auth', (req, res) => {
    if (req.body.username === config.server.username && req.body.password === config.server.password) {
        res.status(200).json({
            token : jwt.sign({
                username: req.body.username,
                password: req.body.password
            }, config.server.secret)
        });
    } else {
        res.sendStatus(401);
    }
});

io.use(socketioJwt.authorize({
    secret: config.server.secret,
    handshake: true
}));

io.on('connection', async function(socket) {
    const notifications = await Database.getNotifications();

    // console.log(notifications);

    socket.emit('notifications', {
        notifications: notifications
    });

    socket.on('get', async function() {
        const notifications = await Database.getNotifications();

        // console.log(notifications);

        socket.emit('notifications', {
            notifications: notifications
        });
    });
});