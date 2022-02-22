const express = require('express');
const cors = require('cors');
const env = require('./env');
const { SlimNodeMySQL } = require('slim-node-mysql');

const db = new SlimNodeMySQL(env.CLEARDB_DATABASE_URL);
const app = express();
app.use(express.json());
// app.use(cors());

const corsOptions = {
    origin: ['https://igorkurdej.github.io/motorcycles-rental/', 'igorkurdej.github.io/motorcycles-rental/'],
    credentials: true,
}

app.use(cors(corsOptions))

const port = process.env.PORT || 3001;

app.get('/motorcycles', (req, res) => {
    db
        .query("SELECT * FROM motorcycles")
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.post('/register', (req, res) => {
    db
        .query(
            `INSERT INTO user (firstname, lastname, email, phone, password) VALUES (@firstname, @lastname, @email, @phone, @password)`,
            { ...req.body }
        )
        .then(() => res.send('Zarejestrowano pomyślnie'))
        .catch(err => console.log(err));
});

app.post('/login', (req, res) => {
    db
        .query(
        'SELECT * FROM user WHERE email = @email AND password = @password',
        {...req.body}
        )
        .then(result => {res.send(result)})
        .catch(err => console.log(err)
    );
});

app.post('/booking', (req, res) => {
    db
        .query(
            'INSERT INTO reservation (startDate, endDate, price, userId, motorcycleId) VALUES (@startDate, @endDate, @price, @userId, @motorcycleId)',
            {...req.body})
        .then(() => res.send('Zarezerwowano'))
        .catch((err) => console.log(err));
});

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(`SELECT * FROM user WHERE id = ${id}`)
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.get('/userReservation/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(
        `SELECT reservation.id, reservation.startDate, reservation.endDate, reservation.price, motorcycles.marka, motorcycles.model, motorcycles.img, motorcycles.cena
             FROM reservation 
             INNER JOIN motorcycles ON reservation.motorcycleId = motorcycles.id 
             WHERE userId = ${id}`)
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.delete('/deleteReservation/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(`DELETE FROM reservation WHERE id = @id`, {id: id})
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.put('/updateReservation', (req, res) => {
    const id = req.body.id;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const price = req.body.price;

    db.query(
        'UPDATE reservation SET startDate = ?, endDate = ?, price = ? WHERE id = ?',
        [startDate, endDate, price, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

app.listen(port, () => console.log(`Server is running on port ${port}`));