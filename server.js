const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { expressjwt: exjwt } = require('express-jwt')
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;
const secretKey = 'My secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});
let users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin'
    },
    {
        id: 2,
        username: 'guest',
        password: 'guest'
    }
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    /*console.log('bleh', username, password);
    res.json({ data: 'it works'});*/
    for (let user of users){
        if (user.username === username && user.password === password){
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, {expiresIn: '7d'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    console.log(req)
    res.json({
        success: true,
        MyContent: 'Welcome to the dashboard'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    console.log(req)
    res.json({
        success: true,
        MyContent: 'Welcome to settings'
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
    console.log(err.name === 'UnauthorizedError');
    console.log(err);
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officalError: err,
            err: 'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

