const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./db/config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/books', async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
});
app.get('/authors', async (req, res) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching authors.' });
    }
});
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
        });
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the book.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});