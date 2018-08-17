require('dotenv').config();

import config from "./config";
import Bot from "./bot/bot";
import Web from "./web/web";

// configuration


// the app contains current parts
const bot = new Bot(config);
const web = new Web(config);

