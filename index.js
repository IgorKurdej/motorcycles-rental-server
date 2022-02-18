const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/motorcycles', (req,res) => {
    db.query(
        "SELECT * FROM motorcycles",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result)
            }
        }
    )
});

app.post('/motorcycles', (req, res) => {
    const motorcycleId = req.body.motorcycleId;

    db.query(
        `SELECT * FROM motorcycles WHERE id = ?`,
        [motorcycleId],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
});

app.post('/register', (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    db.query(
        'INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, email, phone, password],
        (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Values inserted');
            }
        }
    )

})



app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
});

app.post('/booking', (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const price = req.body.price;
    const userId = req.body.userId;
    const motorcycleId = req.body.motorcycleId;

    db.query(
        'INSERT INTO reservation (startDate, endDate, price, userId, motorcycleId) VALUES (?, ?, ?, ?, ?)',
        [startDate, endDate, price, userId, motorcycleId],
        (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Values inserted');
            }
        }
    )
})


app.post('/userReservation', (req, res) => {
    const userId = req.body.userId;

    db.query(
        'SELECT reservation.id, reservation.startDate, reservation.endDate, reservation.price, motorcycles.marka, motorcycles.model, motorcycles.img FROM reservation INNER JOIN motorcycles ON reservation.motorcycleId = motorcycles.id WHERE userId = ?',
        [userId],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
});

app.delete('/deleteReservation/:id', (req, res) => {
    const id = req.params.id;
    db.query(
        `DELETE FROM reservation WHERE id = ${id}`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )
})

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

app.listen(3001, () => console.log('Server is running on port 3001'));