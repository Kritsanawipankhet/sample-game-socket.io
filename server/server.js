const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const fs = require('fs');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000 || process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';
const certs = {
    key: fs.readFileSync('certs/private.key'),
    cert: fs.readFileSync('certs/certificate.crt'),
    ca: fs.readFileSync('certs/ca_bundle.crt')
}

let app = express();
let server = https.createServer(certs,app);
let io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}. `);

});

let value;
io.on('connection',(socket) =>{
    
    console.log('A user just connected.');
    socket.on('disconnect',()=>{
        console.log('A user has disconnected.');
    })
    socket.on('startGame', () => {
        socket.emit('startGame',value);
    })
    socket.on('crazyIsClicked', (data) => {
        value = data;
        io.emit('crazyIsClicked', data);
        console.log(data);
    });
});

