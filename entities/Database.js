const { EventEmitter } = require('events');
//const { existsSync, writeFile } = require('fs');
const { dbDumpFile } = require('../config');
const File = require('./File');
const fs = require('fs');

class Database extends EventEmitter {
  constructor() {
    super();

    this.uploadedImages = {};
  }

  async initFromDump() {
    fs.access(dbDumpFile, (err) => {
      if (err) {
        return;
      }

      const dump = require(dbDumpFile);

      if (typeof dump.uploadedImages === 'object') {
        this.uploadedImages = {};

        for (let id in dump.uploadedImages) {
          const file = dump.uploadedImages[id];

          this.uploadedImages[id] = new File(file.id, file.createdAt);
        }
      }

    });
  }

  insert(file) {
    this.uploadedImages[file.id] = file;
    this.emit('changed');
  }

  async remove(fileId) {
    const file = this.uploadedImages[fileId];
    const fileToDelete = new File(file.id, file.size, file.filename);

    await fileToDelete.removeOriginal();

    delete this.uploadedImages[fileId];

    this.emit('changed');

    return fileId;
  }

  find() {
    let allImages = Object.values(this.uploadedImages);

    console.log(this.uploadedImages);

    allImages.sort((img1, img2) => (img2.uploadedAt -  img1.uploadedAt));

    return allImages;
  }

  toJSON() {
    return {
      uploadedImages: this.uploadedImages
    }
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', async () => {
  await fs.writeFile(dbDumpFile, JSON.stringify(db.toJSON(), null, '\t'), () => {});
});

module.exports = db;