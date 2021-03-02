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
    keyPath: './cert/coze-private.pem.key',
    certPath: './cert/coze-certificate.pem',
    caPath: './cert/CA1',
    clientId: 'kitiot',
    host: 'a12sdpa3mvbfjt-ats.iot.us-west-2.amazonaws.com',
    region: 'us-east-1',
    debug: true
});


thingShadows.on('connect', function() {
    console.log('Connected to AWS IoT');

    // $aws/things/coze-2021-001/shadow/update

        thingShadows.publish('$aws/things/coze-2021-001/shadow/update', 'Compra Aprovada'  );
        thingShadows.subscribe('$aws/things/coze-2021-001/shadow/update');


    thingShadows.on('message', function(topic, payload) {
            console.log('message', topic, payload.toString());
        });


});
