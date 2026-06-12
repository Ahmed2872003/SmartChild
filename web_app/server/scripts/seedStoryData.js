const path = require('path');
const fs = require('fs/promises');
const { StoryModel } = require('../models/index');
const runSeeder = require('./seeder');

const seedStoriesData = async () => {
  console.log('Clearing old story data...');

  await StoryModel.deleteMany({});

  const storiesBaseDir = path.join(__dirname, '../public/stories');

  const validCategories = ['happiness', 'anxiety_depression', 'anger_aggression'];
  const formattedStories = [];

  console.log('Scanning file system for stories...');

  for (const category of validCategories) {
    const enDir = path.join(storiesBaseDir, category, 'en');

    let files;
    try {
      files = await fs.readdir(enDir);
    } catch (err) {
      console.log(`Skipping ${category} - Directory not found.`);
      continue;
    }

    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const baseFilename = file.replace('.pdf', '');

        const formattedTitle = baseFilename
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        formattedStories.push({
          title: formattedTitle,
          category: category,
          filePath: {
            en: `/public/stories/${category}/en/${file}`,
            ar: `/public/stories/${category}/ar/${file}`,
          },
          cover: `/public/stories/covers/${baseFilename}.png`,
        });
      }
    }
  }

  console.log(`Found ${formattedStories.length} stories. Inserting into database...`);

  if (formattedStories.length > 0) {
    await StoryModel.insertMany(formattedStories);
  } else {
    console.log('No stories found to insert.');
  }
};

runSeeder(seedStoriesData);
