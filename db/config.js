const mongoose =  require('mongoose');
mongoose.connect('mongodb+srv://chzahidm431:42aVLxBa3WTpACy1@cluster0.pn9eto2.mongodb.net/');
const dotenv =  require('dotenv');
dotenv.config();
mongoose.set('strictQuery', false);
//42aVLxBa3WTpACy1  chzahidm431