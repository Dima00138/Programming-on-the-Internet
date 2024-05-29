import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { Database } from './Database';
import axios from 'axios';

const token = '7004777368:AAE5L04QM7unWOSeIEY0wZKDzY9HNNhsj9g';
const bot = new TelegramBot(token, {polling: true});
const database = new Database();

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.toLowerCase();

    if (msg.text) {
        bot.sendMessage(chatId, `Echo: ${msg.text}`);
    } else if (msg.sticker) {
        bot.sendSticker(chatId, msg.sticker.file_id);
    } else if (msg.photo) {
        const photo = msg.photo.sort((a, b) => (b.file_size ?? 0) - (a.file_size ?? 0))[0];
        bot.sendPhoto(chatId, photo.file_id);
    } else {
        bot.sendMessage(chatId, 'Я не понимаю этот тип сообщения.');
    }


    if (text?.includes('привет')) {
        bot.sendSticker(chatId, 'CAACAgIAAxkBAAErFxdmLK7Bj9ICOoCXF65--IKEjtaYVAACJz0AAscMKUgFVa_4oSuFETQE');
    }
});

function formatWeatherData(data: any) {
    const temperature = data.main.temp - 273.15; // Конвертация из Кельвинов в градусы Цельсия
    const feelsLike = data.main.feels_like - 273.15; // Конвертация из Кельвинов в градусы Цельсия
    const pressure = data.main.pressure;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const timezone = data.timezone / 3600; // Конвертация из секунд в часы
    const city = data.name;

    return `Погода в ${city}:
        Температура: ${temperature.toFixed(2)}°C (ощущается как ${feelsLike.toFixed(2)}°C)
        Давление: ${pressure} мбар
        Влажность: ${humidity}%
        Скорость ветра: ${windSpeed} м/с (направление ${windDirection}°)
        Восход солнца: ${sunrise}
        Закат солнца: ${sunset}
        Часовой пояс: UTC${timezone < 0 ? timezone : '+' + timezone}`;
}


bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    let city = match?.[1].trim();
    if (city == '' ||city == null || city == undefined)
        city = "Moscow"
    try {
    const weatherData = await getWeatherData(city);
    bot.sendMessage(chatId, formatWeatherData(weatherData))
    }catch (e) {
        bot.sendSticker(chatId, 'CAACAgQAAxkBAAErFxVmLK69mj7k7ZQpXWUqvPEknrdJxQACyQwAAsR7YVEfOkomST1-7zQE');
    }
});

async function getWeatherData(city: string) {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cc653bc922b90ea72af41ddf22540c12`);
    return response.data;
}

bot.onText(/\/joke/, async (msg) => {
    const chatId = msg.chat.id;
    const joke = await getJoke();
    bot.sendMessage(chatId, joke);
});

async function getJoke() {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    return response.data.setup + ' ' + response.data.punchline;
}

bot.onText(/\/cat/, async (msg) => {
    const chatId = msg.chat.id;
    const imageUrl = await getRandomCatImage();
    bot.sendPhoto(chatId, imageUrl);
});

async function getRandomCatImage() {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    return response.data[0].url;
}


bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    database.subscribe(chatId);
    bot.sendMessage(chatId, 'Вы подписались на ежедневную рассылку.');
});

bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    database.unsubscribe(chatId);
    bot.sendMessage(chatId, 'Вы отписались от ежедневной рассылки.');
});

cron.schedule('0 0 * * *', async () => {
    const subscribers = await database.getSubscribers();
    subscribers.forEach(chatId => {
        bot.sendMessage(chatId, getRandomFact()); // Замените на реальный факт
    });
});

const facts = [
    "Самая крупная жемчужина в мире достигает 6 килограммов в весе.",
    "Законодательство США допускало отправку детей по почте до 1913 года.",
    "В языке древних греков не существовало слова, которое обозначало религию.",
    "В современной истории есть промежуток времени, когда на счетах компании «Apple», было больше средств, чем у американского правительства.",
    "Среднее облако весит порядка 500 тонн, столько же весят 80 слонов.",
    "В Ирландии никогда не было кротов.",
    "Флот США содержит больше авианосцев, чем все флоты мира вместе взятые.",
    "Скорость распространения лавы после извержения, близка к скорости бега гончей.",
    "Изначально, отвертка была изобретена для выковыривания гвоздей, шуруп был изобретен на 100 лет позже.",
    "Библия – книга, которую чаще всего воруют в американских магазинах.",
    "Примерно 1/3 всей соли, производимой в США, расходуется на очистку дорог ото льда.",
    "Существует пробирка, диаметр которой, в 10000 раз меньше диаметра человеческого волоса.",
    "Саудовская Аравия не содержит рек.",
    "В Антарктиде существует единственная река – Оникс, она течет всего 60 дней в году.",
    "У медуз нет мозгов и кровеносных сосудов.",
    "Ежедневно 60 человек становятся миллионерами.",
    "До 17 века термометры заполняли коньяком.",
    "Кошки спят больше половины своей жизни.",
    "Лимон содержит больше сахара, чем клубника.",
    "Самый долгий полёт курицы продолжался 13 секунд.",
    "Ладожское озеро является самым большим в Европе.",
    "За год на Землю падает до 500 кг марсианского метеорита.",
    "Земля делает полный оборот вокруг своей оси за 23 часа 56 минут и 4 секунды.",
    "На Юпитере регулярно идут алмазные дожди.",
    "Во вселенной больше звёзд, чем песчинок на всех пляжах Земли.",
    "В мире всего 7% левшей",
    "Правое лёгкое человека вмещает больше воздуха, чем левое.",
    "Самая трудно излечимая фобия – боязнь страха.",
    "Алмазы могут гореть.",
    "Корова может подняться по лестнице, но не может спуститься.",
    "Утки способны нырять на глубину до 6 метров.",
    "Китайский язык является самым популярным в мире.",
    "У жирафа и человека одинаковое количество шейных позвонков.",
    "Самое высокое здание в Европе находится в Москве.",
    "Страусы развивают скорость до 70 км в час."
];

// Функция для выбора случайного факта из списка
function getRandomFact(): string {
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
}
