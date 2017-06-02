import * as express from 'express';
import * as builder from 'botbuilder';
import * as bot_handoff from 'bot_handoff';

//=========================================================
// Normal Bot Setup
//=========================================================

const app = express();

// Setup Express Server
app.listen(process.env.port || process.env.PORT || 3978, '::', () => {
    console.log('Server Up');
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

app.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, [
    function (session, args, next) {
        session.endConversation('Echo ' + session.message.text);
    }
]);

//=========================================================
// Hand Off Setup
//=========================================================

// Replace this function with custom login/verification for agents
const isAgent = (session: builder.Session) => session.message.user.name.startsWith("Agent");
const isOperator = (session: builder.Session) => session.message.user.name.startsWith("Operator");

bot_handoff.setup(bot, app, isAgent, isOperator, {
    mongodbProvider: process.env.MONGODB_PROVIDER,
    directlineSecret: process.env.MICROSOFT_DIRECTLINE_SECRET
});
