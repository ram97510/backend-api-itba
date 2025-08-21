const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 5050
var cors = require('cors');
app.use(cors());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/inbox', db.getInbox);
app.get('/inbox/:cid', db.viewInbox);
app.post('/inbox/doc', db.viewDocByCidAndPan);
app.post('/inbox', db.saveInbox);
app.post('/inbox/update-doc', db.updateDoc);
///app.delete('/inbox/:cid', db.deleteInbox);///
app.delete('/inbox', db.deleteInbox);


app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

