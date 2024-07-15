const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware do obsługi danych w formacie JSON
app.use(express.json());
app.use(cors());

// Obsługa danych formularza od administratora
app.post('/api/add-post', (req, res) => {
    const { title, content } = req.body;

    // Tutaj dodaj kod do zapisu wpisu do bazy danych lub do przechowywania w pamięci
    console.log(`Dodano nowy wpis: ${title} - ${content}`);

    res.status(200).send('Wpis dodany pomyślnie');
});

// Obsługa innych żądań, np. pobieranie wpisów z bloga
app.get('/api/get-posts', (req, res) => {
    const posts = [
        { title: 'Przykładowy tytuł', content: 'Przykładowa treść wpisu' }
    ];

    res.status(200).json(posts);
});

// Obsługa błędów dla niezidentyfikowanych tras
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Obsługa ogólnych błędów
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// Start serwera na wybranym porcie
app.listen(port, () => {
    console.log(`Serwer uruchomiony na http://localhost:${port}`);
});
