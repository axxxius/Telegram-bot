const TelegramApi = require('node-telegram-bot-api');

const token = '5962061274:AAFHokoQAS79ze_zqtfPvzh411jXCYuQVqc';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '7'}],
            [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}],
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра отгадай цифру'}
])


const start = () => {
    bot.on('message',  async msg => {
        console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await  bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9c6/466/9c6466ca-b889-32bb-9d59-236976964393/1.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот, который позволяет испытать свою удачу и доказать, что у человечества есть хоть какие-то шансы против восстания машин! Автор бота - Илья Коноплицкий. Моему автору будет приятно, если ты напишешь ему о моей работоспособности)`);
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} - о боже, а как это случилось?`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты отгадал ${chats[chatId]}`, againOptions)
        } 
        
        return bot.sendMessage(chatId, `Видимо у человечества мало шансов, ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        
    })
}

start()
