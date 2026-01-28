const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDb = require('./config/db');
const path = require('path');

// Connect DB
connectDb();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/buildings', require('./routes/buildings.routes'));
app.use('/api/inspections', require('./routes/inspections.routes'));
app.use('/api/tasks', require('./routes/tasks.routes'));
app.use('/api/claims', require('./routes/claims.routes'));
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/uploads', require('./routes/uploads.routes'));

// Serve uploads statically with absolute path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => res.json({ ok: true, service: 'cleaning-reports-backend' }));

module.exports = app;
