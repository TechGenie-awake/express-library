import express from 'express';
import prisma from './prisma/client.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('api/v1/books', async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
});
app.get('api/v1/authors', async (req, res) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching authors.' });
    }
});
app.get('api/v1/books/:id', async (req, res) => {
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
app.post('api/v1/authors', async (req, res) => {
    const { 
        first_name,
        family_name,
        date_of_birth,
        date_of_death,
        url
    } = req.body;

    try {
        const newAuthor = await prisma.author.create({
            data: {
                first_name,
                family_name,
                date_of_birth: new Date(date_of_birth),
                date_of_death: date_of_death ? new Date(date_of_death) : null,
                name: `${first_name} ${family_name}`,
                life_span: date_of_death
                    ? `${date_of_birth} - ${date_of_death}`
                    : `${date_of_birth} - present`,
                url: url || null,
            },
        });

        res.status(201).json(newAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating author.' });
    }
});
app.post('api/v1/books', async (req, res) => {
    const { 
        title,
        authorId,
        summary,
        isbn,
        genreIds
    } = req.body;

    try {
        const newBook = await prisma.book.create({
            data: {
                title,
                authorId,
                summary,
                isbn,
                genres: {
                    create: genreIds.map((genreId) => ({
                        genre: {
                            connect: { id: genreId },
                        },
                    })),
                },
            },
        });

        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating book.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});