const { v4: uuid } = require('uuid');

class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const booksStor = {
  books: [
    new Book(),
    new Book(),
    {
      id: '50344d98-29b2-402b-92f8-7149473019c2',
      title: '',
      description: '',
      authors: '',
      favorite: '',
      fileCover: '',
      fileName: '50344d98-29b2-402b-92f8-7149473019c2 _id_ ddddddddddddddd.pdf',
      fileBook: 'CV Kapranova.pdf',
    },
  ],
};

module.exports = {
  Book,
  booksStor,
};
