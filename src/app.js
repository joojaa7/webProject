import express from 'express';
import api from './api/index.js';

const app = express();

//Placeholder code
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('Code'));
app.use('/', express.static('uploads'));

app.use('/', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});


// import api from './api/index.js';

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use('/api/v1', api);

export default app;