const mongoose = require('mongoose');
const Word = require('./routes/Words/models/Word');
const wordSeed = require('./wordSeed.json');
require('dotenv').config();

const seedFunc = async () => {
    try {
        const data = await Word.create(wordSeed);
        await console.log(`${data.length} records created.`);

        await mongoose.disconnect();

        console.log('MongoDB disconnected.');
        process.exit(0);
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}

mongoose  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
      console.log('MongoDB Connected.');
      mongoose.connection.db.dropDatabase();
  })
  .then(() => {
      seedFunc();
  })
  .catch(err => console.log('MongoDB Error:', err));