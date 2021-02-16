import * as pipeuService from './lib/PipeuService'
import { get } from 'lodash'
var awsIot = require('aws-iot-device-sdk');

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




