const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();

const { PORT, uploadsFolder } = require('./config');

const db = require('./entities/Database');
const File = require('./entities/File');

const storage = multer.diskStorage({
  destination: uploadsFolder,
  filename: function (req, file, callback) {
    let id = nanoid(8);
    let name = id + '.jpeg';

    callback(null, name);
  },
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/upload', multer({ storage }).single('image'), (req, res) => {
  let id = req.file.filename.split('.')[0];

  const imgFile = new File(id, req.file.size, req.file.filename);

  db.insert(imgFile);

  res.set('content-type', 'application/json');
  return res.json({ id });
});

app.get('/list', (req, res) => {
  const uploadedFiles = db.find().map(file => file.toPublicJSON());

  res.set('content-type', 'application/json');
  return res.json(uploadedFiles);
});

app.get('/image/:id', (req, res) => {

  res.set('content-type', 'image/*');
  res.download(path.resolve(uploadsFolder, req.params.id + '.jpeg'));
});

app.get('/merge', (req, res) => {});

app.delete('/image/:id', async(req, res) => {
  const fileId = req.params.id;
  const id = await db.remove(fileId);

  res.set('content-type', 'application/json');
  return res.json({id});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});