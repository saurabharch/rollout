const fs = require('fs').promises;
const sharp = require('sharp');

const { CONFIG } = require('../config');

/**
 * Give a path returns a buffer
 */
function readFileFromLocation(path) {
  return fs.readFile(path);
}

/**
 * Give a path returns a buffer
 */
function saveImageToPermanentLocation(fileId, resizedBuffer) {
  return fs.writeFile(
    `${CONFIG.PERMANENT_LOCATION}/${fileId}.png`,
    resizedBuffer
  );
}

/**
 * Takes file object with a path and returns resized image buffer
 *
 */
async function resizeImage(fileBuffer) {
  const resizeHeight = 100;
  const resizeWidth = 100;

  return sharp(fileBuffer)
    .resize(resizeWidth, resizeHeight)
    .toBuffer();
}

/**
 *
 */

async function getImageMetaData(imageLocation) {
  return sharp(imageLocation).metadata();
}

/**
 *
 */
async function resizeAndSaveImage(file) {
  if (!file.path || !file.id) {
    throw new Error('Given file object is not valid');
  }

  const fileBuffer = await readFileFromLocation(file.path);
  const resizedBuffer = await resizeImage(fileBuffer);
  const savedImage = await saveImageToPermanentLocation(file.id, resizedBuffer);

  return savedImage;
}

module.exports = {
  readFileFromLocation,
  getImageMetaData,
  resizeAndSaveImage,
};