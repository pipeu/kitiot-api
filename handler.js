import * as pipeuService from './lib/PipeuService'
import { get } from 'lodash'
var awsIot = require('aws-iot-device-sdk');
var path = require('path')

const apiVersion = 'v1.0'
// Require and init API router module
const app = require('lambda-api')({ version: apiVersion,
    base: 'kitiot',
    logger: {
        level: 'info', // debug
        timestamp: () => new Date().toUTCString(), // custom timestamp
        stack: true
    } })

app.use((req, res, next) => {
    res.cors() // Define Middleware
    next()
})

const generateResult = (status, result) => {
    const jRes = {
        status: status,
        stage: '' + process.env.stage,
        result: result,
        version: apiVersion
    }
    return jRes
}

// API routes
app.get('/status', async (req, res) => {


// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
    var thingShadows = awsIot.thingShadow({
        keyPath: path.resolve(__dirname, './cert/private.pem.key'),
        certPath: path.resolve(__dirname, './cert/certificate.pem.crt'),
        caPath: path.resolve(__dirname, './cert/root-CA.crt'),
        clientId: 'kitiot',
        host: 'a28g4okfvsmwt-ats.iot.us-east-1.amazonaws.com',
        region: 'us-east-1',
        debug: true
    });

// Client token value returned from thingShadows.update() operation
//
    var clientTokenUpdate;

//
// Simulated device values
//
    var rval = 187;
    var gval = 114;
    var bval = 222;

    thingShadows.on('connect', function() {
        console.log('Connected to AWS IoT');
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
//
        thingShadows.register( 'Classic Shadow', {}, function() {

// Once registration is complete, update the Thing Shadow named
// 'RGBLedLamp' with the latest device state and save the clientToken
// so that we can correlate it with status or timeout events.
//
// Thing shadow state
//
            var rgbLedLampState = {"state":{"desired":{"red":rval,"green":gval,"blue":bval}}};

            clientTokenUpdate = thingShadows.update('RGBLedLamp', rgbLedLampState  );
//
// The update method returns a clientToken; if non-null, this value will
// be sent in a 'status' event when the operation completes, allowing you
// to know whether or not the update was successful.  If the update method
// returns null, it's because another operation is currently in progress and
// you'll need to wait until it completes (or times out) before updating the
// shadow.
//
            if (clientTokenUpdate === null)
            {
                console.log('update shadow failed, operation still in progress');
            }
        });
    });
    thingShadows.on('status',
        function(thingName, stat, clientToken, stateObject) {
            console.log('received '+stat+' on '+thingName+': '+
                JSON.stringify(stateObject));
//
// These events report the status of update(), get(), and delete()
// calls.  The clientToken value associated with the event will have
// the same value which was returned in an earlier call to get(),
// update(), or delete().  Use status events to keep track of the
// status of shadow operations.
//
        });

    thingShadows.on('delta',
        function(thingName, stateObject) {
            console.log('received delta on '+thingName+': '+
                JSON.stringify(stateObject));
        });

    thingShadows.on('timeout',
        function(thingName, clientToken) {
            console.log('received timeout on '+thingName+
                ' with token: '+ clientToken);
//
// In the event that a shadow operation times out, you'll receive
// one of these events.  The clientToken value associated with the
// event will have the same value which was returned in an earlier
// call to get(), update(), or delete().
//
        });

    return { status: 'ok' }
})


const createMessage = async (event) => {
    console.log('createMessage')

    let message = event.message

    console.log('message', message)
    console.log('message.contents', JSON.stringify(message.contents))

    if (message && message.contents) {
        message.contents.forEach(m => {
            console.log('m.type', m.type)
            console.log('m.text', m.text)
        })
    }

    let visitorName = ''
    if (message.visitor) {
        visitorName = message.visitor.name
        console.log('message.visitor.name', message.visitor.name)
    }

    let subject = 'New message from WhatsApp'

    // const result = await kontatoService.createCCMessageFromWhatsApp()

    return 'ok'
}



app.post('/message', async (req, res) => {
    console.log('message req.headers.stage:', req.headers.stage)
    console.log('Received event:', JSON.stringify(req.body, null, 2))

    let event = req.body

    console.log('event.stringify', JSON.stringify(event))

    const result = await createMessage(event)

    console.log('result', result)

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    return res.status(200).json(generateResult('ok', {}))
})

app.post('/messageStatus', async (req, res) => {
    console.log('messageStatus req.headers.stage:', req.headers.stage)
    console.log('messageStatus Received event:', JSON.stringify(req.body, null, 2))

    let event = req.body

    console.log('event.stringify', JSON.stringify(event))

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    return res.status(200).json(generateResult('ok', {})) // result
})

app.options('/*', (req, res) => {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'StoreId', 'storeid', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.status(200).send({})
})

const getMessageId = event => get(event, 'Records[0].ses.mail.messageId');
const getRecipient = event => get(event, 'Records[0].ses.receipt.recipients[0]');



// module.exports.router
export const router = async (event, context) => {
    console.log('kontato-whatsapp:' + process.env.stage)
    console.log('current.env.MESSAGE:' + process.env.MESSAGE)

    context.callbackWaitsForEmptyEventLoop = false

    return await app.run(event, context)
}




