const http = require('http');
var awsIot = require('aws-iot-device-sdk');

const hostname = '127.0.0.1';
const port = 3000;

// const server = http.createServer((req, res) => {
//
//     console.log('createServer')
//
//     var thingShadows = awsIot.thingShadow({
//         keyPath: './cert/private.pem.key',
//         certPath: './cert/certificate.pem.crt',
//         caPath: './cert/root-CA.crt',
//         clientId: 'kitiot',
//         host: 'a28g4okfvsmwt-ats.iot.us-east-1.amazonaws.com',
//         region: 'us-east-1',
//         debug: true
//     });
//
//
//     thingShadows.on('connect', function() {
//         console.log('Connected to AWS IoT');
//     })
//
//
//
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });
//
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

var thingShadows = awsIot.device({
    keyPath: './cert/5734070db5-private.pem.key',
    certPath: './cert/5734070db5-certificate.pem.crt',
    caPath: './cert/CA1',
    clientId: 'kitiot',
    host: 'a28g4okfvsmwt-ats.iot.us-east-1.amazonaws.com',
    region: 'us-east-1',
    debug: true
});


thingShadows.on('connect', function() {
    console.log('Connected to AWS IoT');


        thingShadows.publish('$aws/things/esp32_temp/shadow/update', 'Compra Aprovada'  );
        thingShadows.subscribe('$aws/things/esp32_temp/shadow/update');


    thingShadows.on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });


});
