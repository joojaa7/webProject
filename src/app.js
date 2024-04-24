import express from 'express';
import api from './api/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('Code'));
app.use('/', express.static('uploads'));

app.use('/', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});


export default app;