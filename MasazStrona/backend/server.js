const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');

const app = express();
const port = 3000;

// Utwórz bazę danych NeDB
const db = new Datastore({ filename: 'posts.db', autoload: true });

// Middleware do obsługi danych w formacie JSON
app.use(express.json());
app.use(cors());

// Obsługa danych formularza od administratora
app.post('/api/add-post', (req, res) => {
    const { title, content } = req.body;

    // Najpierw dodaj nowy wpis
    db.insert({ title, content, createdAt: new Date() }, (err, newPost) => {
        if (err) {
            res.status(500).send('Wystąpił problem podczas dodawania wpisu');
            return;
        }

        // Pobierz wszystkie wpisy i ogranicz liczbę do 5
        db.find({}).sort({ createdAt: -1 }).exec((err, posts) => {
            if (err) {
                res.status(500).send('Wystąpił problem podczas pobierania wpisów');
                return;
            }

            if (posts.length > 5) {
                // Usuń najstarsze wpisy, aby liczba wpisów była równa 5
                const idsToRemove = posts.slice(5).map(post => post._id);
                db.remove({ _id: { $in: idsToRemove } }, { multi: true }, (err, numRemoved) => {
                    if (err) {
                        res.status(500).send('Wystąpił problem podczas usuwania starych wpisów');
                        return;
                    }

                    res.status(200).send('Wpis dodany pomyślnie');
                });
            } else {
                res.status(200).send('Wpis dodany pomyślnie');
            }
        });
    });
});

// Obsługa innych żądań, np. pobieranie wpisów z bloga
app.get('/api/get-posts', (req, res) => {
    db.find({}).sort({ createdAt: -1 }).exec((err, posts) => {
        if (err) {
            res.status(500).send('Wystąpił problem podczas pobierania wpisów');
            return;
        }

        res.status(200).json(posts);
    });
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
