import express, { Request, Response, Application } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { routes } from './modules/common/routes.index';
import path from 'path';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import * as exphbs from 'express-handlebars';
import * as bodyParser from 'body-parser';

// Metrics
import responseTime from 'response-time';
import {
    restResponseTimeHistogram,
    startMetricsServer,
} from './modules/common/utils/metrics';

// Swagger
import swaggerUi from 'swagger-ui-express';
import specs from './modules/common/swagger';

// UI
import handlebars from 'handlebars';

// Telegram Bot
import { Telegraf } from 'telegraf';

// Socket & Redis
import { createClient } from 'redis';
import * as WebSocket from 'ws';

import {
    askFromOpenAI,
    getMessageFromOpenAI,
    sendMessageThruData,
} from './modules/chat-module/chat-controller';
import { IChatMessage } from './modules/common/interfaces';
import { botCommand } from './modules/open-ai-bot-module/botinit';
import logger from './modules/common/utils/logger';

// import formData from 'express-form-data';
// import * as os from 'os';

const app: Application = express();

// Socker Configuration
const wss = new WebSocket.Server({
    port: Number(process.env.CELEB_API_SOCKET_PORT) || 9000,
});

// Connect to Redis cache
const cache = createClient({
    url: 'redis://cache-redis:6379',
});

// Connect to Redis queue
const queue = createClient({
    url: 'redis://queue-redis:6380',
});

// Logger
app.use(morgan('dev'));

// handle and manage cross-origin calls
app.use(cors({ origin: '*' }));
app.enable('trust proxy');

// handle and manage json requests
app.use(bodyParser.json()); // for JSON
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));

// Handle UI
// ** Views
// Set Template engine to handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/../src/views/'));
app.engine(
    'hbs',
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: __dirname + '/../src/views/layouts/',
    }),
);

app.get('/', function (req: any, res: any) {
    // This code is never reached on 'GET /' requests.
    res.render('home/home');
});

// Metrics
app.use(
    responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: res.statusCode,
                },
                time * 1000,
            );
        }
    }),
);

// Swagger API docs
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Celeb API Docs',
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// handle API routes
app.use('/healthcheck', async (_request: Request, response: Response) => {
    response.status(200).json({ message: 'Hello Server' });
});
// API: version 1
app.use('/api/v1', routes);

///
// Redis
const queueSubscriber = queue.duplicate();

const clients: any = [];
let clientId = 0;

// Websocket
wss.on('connection', function connection(ws) {
    const id = clientId++;
    clients[id] = ws;

    logger.info(`connection id : ${id}`);

    ws.on('message', async function incoming(msg: WebSocket.RawData) {
        const data = JSON.parse(msg.toString());
        logger.info(data);

        if (data.event.includes('send')) {
            logger.info(data.content);
            const replyEvent = data.event.replace(/send/gi, 'reply');

            // Handle message and emit response
            const msgData = data.content;
            const createdMessage = await sendMessageThruData(
                msgData as IChatMessage,
            );
            logger.info(`receive ${data.content}`);

            // Redis
            // queue.rPush(data.event, JSON.stringify(createdMessage));
            // queueSubscriber.publish(data.event, JSON.stringify(createdMessage));

            if (createdMessage) {
                const replyMessage = await getMessageFromOpenAI(
                    createdMessage!.chatroom_id!,
                    createdMessage!.influencer_id!,
                    null,
                );

                // Redis
                // queue.rPush(data.event, JSON.stringify(replyMessage));
                // queueSubscriber.publish(data.event, JSON.stringify(replyMessage));

                // Send message to specific client
                const reply = {
                    event: replyEvent,
                    content: replyMessage,
                };
                ws.send(JSON.stringify(reply));
                logger.info(`reply ${JSON.stringify(reply)} @ ${replyEvent}`);
            }
        } else if (data.event.includes('demo')) {
            // Demo Message
            const demoMsg = {
                role: 'user',
                content: data.content,
            };

            // Redis
            // queue.rPush(data.event, JSON.stringify(demoMsg));
            // queueSubscriber.publish(data.event, JSON.stringify(demoMsg));

            const openAiReply = await askFromOpenAI(data.content);
            const demoReplyEvent = data.event.replace(/submit/gi, 'receive');
            // Demo ReplyMessage
            const demoReply = {
                event: demoReplyEvent,
                content: openAiReply,
            };

            // Redis
            // queue.rPush(data.event, JSON.stringify(demoReply));
            // queueSubscriber.publish(data.event, JSON.stringify(demoReply));

            ws.send(JSON.stringify(demoReply));
            logger.info(`reply ${JSON.stringify(demoReply)} @ ${demoReply}`);
        }
    });

    queueSubscriber.on('message', (channel, message) => {
        const clientWs = clients[id];
        clientWs.emit('/chat/send-message', JSON.parse(message));
    });
});

// Telegram Bot
const bot = new Telegraf(`${process.env.TELEGRAM_BOT_TOKEN}`);
botCommand(bot);
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Port
const port = Number(process.env.port || 8080);
app.listen(port, '0.0.0.0', () => {
    logger.info(`Server is listening to http://localhost:${port}`);
    logger.info(`Current DateTime: ${new Date().toLocaleString()}`);

    // Metrics Server
    startMetricsServer();
});
