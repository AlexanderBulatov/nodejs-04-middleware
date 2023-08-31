const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { booksStor, Book } = require('../database/db');

const fileMulter = require('../middleware/uploadBook');

router.post('/api/user/login', (req, res) => {
  res.status(201).json({ id: 1, mail: 'test@mail.ru' });
});

router.get('/api/books', (req, res) => {
  const { books } = booksStor;
  res.json(books);
});

router.get('/api/books/:id/download', (req, res) => {
  const { id } = req.params;
  const { books } = booksStor;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    fs.readdir(path.join(__dirname, '../public'), (err, filenames) => {
      if (err) {
        res.statusCode(500).send({ message: `Server error: ${err}` });
        return null;
      }
      const downloadFile = filenames.find((filename) => filename.includes(req.params.id, 0));
      return res.download(path.join(__dirname, '../public', downloadFile), downloadFile.replace(`${req.params.id} _id_ `, ''), (e) => {
        if (err) return res.statusCode(500).json({ message: `Downloading error: ${e}` });
        return null;
      });
    });
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

router.get('/api/books/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

router.post(
  '/api/books',
  fileMulter.single('book'),
  (req, res) => {
    if (!req.file) {
      return res.send({ message: 'Ошибка загрузки файла' });
    }
    const { books } = booksStor;

    const {
      title, description, authors, favorite, fileCover,
    } = req.body;
    const newBook = new Book(
      title,
      description,
      authors,
      favorite,
      fileCover,
      req.serverFileName,
      req.initialFileName,
    );

    if (req.body.fileBook) {
      req.serverFileName = `${newBook.id} _id_ ${req.body.fileBook + path.extname(req.file.filename)}`;
    } else {
      req.serverFileName = `${newBook.id} _id_ ${req.initialFileName}`;
    }

    fs.rename(
      path.join(__dirname, '../public', req.file.filename),
      path.join(__dirname, '../public', req.serverFileName),
      (err) => {
        if (err) {
          return res.status(500).json({ message: `Server error ${err}` });
        }
        newBook.fileName = req.serverFileName;
        books.push(newBook);
        return res.status(201).json({ message: 'File uploaded', book: newBook });
      },
    );
    return null;
  },
);

router.put('/api/books/:id', (req, res) => {
  const { books } = booksStor;
  const {
    title, description, authors, favorite, fileCover, fileName,
  } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

router.delete('/api/books/:id', (req, res) => {
  const { books } = booksStor;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json('okey');
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

module.exports = router;
