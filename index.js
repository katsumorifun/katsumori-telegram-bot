import * as dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api';
import i18n from 'i18n';
import path from 'path';
import mongo from './mongose/index.js';
import User from './mongose/models/user.js';

i18n.configure({
    locales: ['en', 'ru'],
    defaultLocale: 'ru',
    queryParameter: 'lang',
    directory: path.join('./', 'locales'),
  });


dotenv.config()
const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.setMyCommands([
    { command: '/menu', description: 'menu' },
    { command: '/subscribe', description: i18n.__('subscribe')},
    { command: '/unsubscribe', description: i18n.__('unsubscribe')},
    { command: '/get_channel', description: i18n.__('get.global.channel')},
    { command: '/get_dev_channel', description: i18n.__('get.dev.channel')},
    { command: '/get_developer', description: i18n.__('get.developer')},
]);

const menuOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: i18n.__('subscribe'), callback_data: 'subscribeNews' }],
            [{ text: i18n.__('unsubscribe'), callback_data: 'unsubscribeNews' }],
            [{ text: i18n.__('get.global.channel'), callback_data: 'getGlobalChannel' }],
            [{ text: i18n.__('get.dev.channel'), callback_data: 'getDevChannel' }],
            [{ text: i18n.__('get.developer'), callback_data: 'getDeveloper' }],
        ]
    })
}


const start = async () => {
    try {
        bot.on('message', async msg => {
            const chatId = msg.chat.id;

            logger(chatId, msg.from, msg.text);

            i18n.setLocale(msg.from.language_code)

            switch(msg.text) {
                case "/menu":
                    await bot.sendMessage(chatId, i18n.__('hello'), menuOptions)
                    break;

                case "/start":
                    await bot.sendMessage(chatId, i18n.__('hello'), menuOptions)
                    break;

                case "/subscribe":
                    await subscribeNews(msg.chat.username, chatId);
                    await bot.sendMessage(chatId, i18n.__('subscribe.success'));
                    break;

                case "/unsubscribe":
                    await unsubscribeNews(chatId);
                    await bot.sendMessage(chatId, i18n.__('unsubscribe.success'));
                    break;    

                case '/get_channel':
                    await bot.sendMessage(chatId, process.env.URL_GLOBAL_CHANNEL);
                    break;  

                case '/get_dev_channel':
                    await bot.sendMessage(chatId, process.env.URL_DEV_CHANNEL);
                    break; 

                case '/get_developer':
                    await bot.sendMessage(chatId, process.env.URL_DEVELOPER);
                    break; 
            }

            if (msg.document !== undefined) {

            }
            // else {
            //     await bot.sendMessage(chatId, i18n.__('command.not_found'));
            // }
        })

        bot.on('callback_query', async msg => {
            const chatId = msg.message.chat.id;

            i18n.setLocale(msg.from.language_code)

            logger(chatId, msg.from, msg.message.text);

            switch(msg.data) {
                case 'subscribeNews':
                    await subscribeNews(msg.message.chat.username, chatId);
                    await bot.sendMessage(chatId, i18n.__('subscribe.success'));
                    break;

                case 'unsubscribeNews':
                    await unsubscribeNews(chatId);
                    await bot.sendMessage(chatId, i18n.__('unsubscribe.success'));
                    break;

                case 'getGlobalChannel':
                    await bot.sendMessage(chatId, process.env.URL_GLOBAL_CHANNEL);
                    break;   

                case 'getDevChannel':
                    await bot.sendMessage(chatId, process.env.URL_DEV_CHANNEL);
                    break; 

                case 'getDeveloper':
                    await bot.sendMessage(chatId, process.env.URL_DEVELOPER);
                    break; 
            }
        })

    } catch (e) {
        console.log(e)
    }
}


start();
console.log('Bot started')


function logger(chat_id, from, message) {
    let data = {
        from,
        message
    }

    console.log('new message:')
    console.log(data)
}


async function subscribeNews(username, user_id) {
    const user = await User.findOne({user_id: user_id}).exec();

    if(user) {
        user.subscribe_news = true;
        user.save();
    } else {
        const user = new User({name: username, user_id, subscribe_news: true})
        user.save();
    }
}

async function unsubscribeNews(user_id) {
    const user = await User.findOne({user_id: user_id}).exec();

    user.subscribe_news = false;
    user.save();
}

async function getUser(user_id) {
    return await User.findOne({user_id: user_id}).exec();
}

