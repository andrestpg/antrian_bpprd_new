require('dotenv').config();
const Layanan = require('./models/Layanan');
const Loket = require('./models/Loket');
const Kategori = require('./models/Kategori');
const KategoriCaller = require('./models/KategoriCaller');

const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
const io = require("socket.io")(http, {
    cors: {
      origin: process.env.BASE_URL,
      methods: ["GET", "POST"]
    }
});
  
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

http.listen(process.env.PORT, () => {
    console.log("Socket.IO server running");
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    limit: "10mb",
}));

app.use(cookieParser());

//Public Dir
app.use(express.static('assets'));

//View Engine
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    socket.on('nextAntrian', async (msg) => {
        io.emit('nextAntrian', msg);
    });
    socket.on('callFromAdmin', async (msg) => {
        io.emit('callFromAdmin', msg);
    });
    socket.on('newAntrian', async (msg) => {
        io.emit('newAntrian', msg);
    });
});

// Home-----------------
app.get('/', async (req, res) => {
    res.redirect('/users');
});

app.get('/tiket', async (req, res) => {
    res.redirect('/publik/tiket');
});

app.get('/antrian', requireAuth, checkUser, async (req, res) => {
    let userId = res.locals.userLogin.id;
    await Loket.belongsTo(Layanan)
    await Loket.belongsTo(Layanan)
    let loket = await Loket.findOne({
        where: {
            userId: userId
        },
        include: Layanan,
    })
    res.render('admin/antrian/index', {
        title: "Data Antrian",
        validation: "",
        script: "antrian.js",
        loket: loket 
    });
});

app.get('/caller', requireAuth, checkUser, async (req, res) => {
    try {
        const userId = res.locals.userLogin.id;

        const kategoriCaller = await KategoriCaller.findOne({
            attributes: ['id', 'userId', 'kategoriId'],
            where: {userId}
        })

        await Promise.all([
            Loket.belongsTo(Layanan),
            Layanan.belongsTo(Kategori),
        ])

        const loket = await Loket.findAll({
            include: {
                model: Layanan,
                include: {
                    model: Kategori,
                    where: {
                        id: kategoriCaller.kategoriId
                    }
                }
            },
        })

        const filtered = loket.filter( it => it.layanan !== null)
        // res.json({filtered})
        res.render('admin/caller/index', {
            title: `Data Antrian ${filtered[0].layanan.kategori.nama}`,
            script: "caller.js",
            loket: filtered 
        });
    } catch (error) {
        console.log(error)
        res.json({
            error: error.sql,
            msg: error.sqlMessage,
        })
    }
});

app.use('/publik', require("./routes/publikRoute"));
app.use('/users', requireAuth, require("./routes/userRoute"));
app.use('/layanan', requireAuth, require("./routes/layananRoute"));
app.use('/loket', requireAuth, require("./routes/loketRoute"));
app.use('/auth', require("./routes/authRoute"));

// 404------------------
app.use((req, res) => {
    res.status(404).render('404', {title: "404"});
});