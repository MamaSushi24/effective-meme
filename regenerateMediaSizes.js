const payload = require('payload');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, './.env'),
});
const COLLECTION_NAME = process.argv[0];
const FOLDER_NAME = process.argv[1] || COLLECTION_NAME;
if (!COLLECTION_NAME) {
  console.log('Please provide a collection name');
  process.exit(0);
}
console.log('Regenerating media sizes for collection:', COLLECTION_NAME);
console.log('Regenerating media sizes in folder:', FOLDER_NAME);
const { PAYLOAD_SECRET_KEY, DATABASE_URI } = process.env;

const regenerateMediaSizes = async () => {
  try {
    await payload.init({
      secret: PAYLOAD_SECRET_KEY,
      mongoURL: DATABASE_URI,
      local: true,
    });

    const media = await payload.find({
      collection: COLLECTION_NAME,
      depth: 0,
      limit: 300,
    });

    await Promise.all(
      media.docs.map(async mediaDoc => {
        try {
          const staticDir = path.resolve(__dirname, './storage/' + FOLDER_NAME);

          await payload.update({
            collection: 'media',
            id: mediaDoc.id,
            data: mediaDoc,
            filePath: `${staticDir}/${mediaDoc.filename}`,
            overwriteExistingFiles: true,
          });

          console.log(
            `Media ${mediaDoc.alt || mediaDoc.id} regenerated successfully`
          );
        } catch (err) {
          console.error(
            `Media ${mediaDoc.alt || mediaDoc.id} failed to regenerate`
          );
          console.error(err);
        }
      })
    );
  } catch (err) {
    console.log('Unable to find documents with payload');
    console.error(err);
    process.exit(0);
  }

  console.log('Media size regeneration completed!');
  process.exit(0);
};

regenerateMediaSizes();
