const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const config = require('config');

const connectToDb = () => {
  mongoose
    .connect(config.get('mongodb_url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => debug('Connected to MongoDB...'))
    .catch((error) => debug('Could not connect to MongoDB...', error));
};

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

// first parameter is name of the document (row), and the schema gives the document a structure
// creating a class
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
  const firstCourse = Course({
    name: 'React Course',
    author: 'Alex',
    tags: ['js', 'frontend'],
    isPublished: true,
  });

  const result = await firstCourse.save();
  debug(result);
};

//createCourse();

module.exports = connectToDb;
