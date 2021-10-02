const path = require('path');
const fs = require('fs/promises');

const { uploadsFolder } = require('../config');

module.exports = class File {
  constructor(id, size, name) {
    this.id = id;
    this.uploadedAt = Date.now();
    this.size = size || 0;
    this.filename = name;
  }

  async removeOriginal() {
    try {
      await fs.unlink(path.resolve(uploadsFolder, this.filename))
    } catch(error) {
      console.log(`removeFile error: file ${this.filename} doesn't exist...`);
    }
  }

  toPublicJSON() {
    return {
      id: this.id,
      uploadedAt: this.uploadedAt,
      size: this.size
    }
  }
}