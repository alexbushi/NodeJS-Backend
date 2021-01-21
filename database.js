const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const config = require('config');

const connectToDb = () => {
  mongoose
    .connect(config.get('mongodb_url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => debug('Connected to MongoDB...'))
    .catch((error) => debug('Could not connect to MongoDB...', error));
};

const courseSchema = mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
  },
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

// first parameter is name of the document (row), and the schema gives the document a structure
// creating a class
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
  const firstCourse = Course({
    name: 'Angular Course',
    author: 'Alex',
    tags: ['js', 'frontend'],
    isPublished: true,
  });

  try {
    const result = await firstCourse.save();
    debug(result);
  } catch (ex) {
    for (field in ex.errors) debug(ex.errors[field].message);
  }
};

//createCourse();

module.exports = connectToDb;
