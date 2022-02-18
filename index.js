const express = require('express');
const cors = require('cors');
const env = require('./env');
const mysql = require('mysql2');
// const { SlimNodeMySQL } = require('slim-node-mysql');

// const db = new SlimNodeMySQL(env.CLEARDB_DATABASE_URL);
const app = express();
app.use(express.json());

// const corsOptions = {
//     origin: ['https://igorkurdej.github.io/motorcycles-rental/', 'igorkurdej.github.io/motorcycles-rental/'],
//     credentials: true,
// }

// app.use(cors(corsOptions))

app.use(cors());



const db = mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.query(
    `SELECT * FROM motorcycles`,
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            // res.send(result);
        }
    }
)

const port = process.env.PORT || 3001;

app.get('/motorcycles', (req, res) => {
    db
        .query("SELECT * FROM motorcycles")
        .then(result => res.send(result))
        .catch(err => console.log(err));

    // db.query(
    //     `SELECT * FROM motorcycles`,
    //     (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.send(result);
    //         }
    //     }
    // )

});

app.get('/reservation', (req, res) => {
    db
        .query("SELECT reservation.id, reservation.startDate, reservation.endDate, reservation.price, motorcycles.marka, motorcycles.model, motorcycles.img FROM reservation INNER JOIN motorcycles ON reservation.motorcycleId = motorcycles.id")
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.get('/users', (req, res) => {
    db
        .query("SELECT * FROM users")
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

// ?????
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
    const {firstname, lastname, email, phone, password} = req.body;

    //, [firstname, lastname, email, phone, password]
    db.query(
        'INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, email, phone, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    )


    // db
    //     .query(`INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)`, {firstname, lastname, email, phone, password})
    //     .then(() => res.send('Values inserted'))
    //     .catch(err => console.log(err));
});

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
    const {startDate, endDate, price, userId, motorcycleId} = req.body;

    db
        .query(
            'INSERT INTO reservation (startDate, endDate, price, userId, motorcycleId) VALUES (?, ?, ?, ?, ?)',
            [startDate, endDate, price, userId, motorcycleId])
        .then(() => console.log('inserted'))
        .catch((err) => console.log(err));
});

// app.post('/userReservation', (req, res) => {
//     const userId = req.body.userId;
//
//     db.query(
//         'SELECT reservation.id, reservation.startDate, reservation.endDate, reservation.price, motorcycles.marka, motorcycles.model, motorcycles.img FROM reservation INNER JOIN motorcycles ON reservation.motorcycleId = motorcycles.id WHERE userId = ?',
//         [userId],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.send(result);
//             }
//         }
//     )
// });

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(`SELECT * FROM users WHERE id = ${id}`)
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.get('/userReservation/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(
        `SELECT reservation.id, reservation.startDate, reservation.endDate, reservation.price, motorcycles.marka, motorcycles.model, motorcycles.img 
             FROM reservation 
             INNER JOIN motorcycles ON reservation.motorcycleId = motorcycles.id 
             WHERE userId = ${id}`)
        .then(result => res.send(result))
        .catch(err => console.log(err));
});

app.delete('/deleteReservation/:id', (req, res) => {
    const id = req.params.id;
    db
        .query(`DELETE FROM reservation WHERE id = ${id}`)
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