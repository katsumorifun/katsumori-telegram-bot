
import * as dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api';

import i18n from 'i18n';
import path from 'path';
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
    { command: '/get_channel', description: i18n.__('get.global.channel')},
    { command: '/get_dev_channel', description: i18n.__('get.dev.channel')},
    { command: '/get_developer', description: i18n.__('get.developer')},
]);

const menuOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: i18n.__('subscribe'), callback_data: 'subscribeNews' }],
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
            const userId = msg.user_id;

            i18n.setLocale(msg.from.language_code)
            
            switch(msg.text) {
                case "/menu":
                    await bot.sendMessage(chatId, i18n.__('hello'), menuOptions)
                    break;

                case "/start":
                    await bot.sendMessage(chatId, i18n.__('hello'), menuOptions)
                    break;

                case "/subscribe":
                    await bot.sendMessage(chatId, i18n.__('subscribe.success'));
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

            await logger(chatId, msg.from, msg.message.text);

            switch(msg.data) {
                case 'subscribeNews':
                    await bot.sendMessage(chatId, i18n.__('subscribe.success'));
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
