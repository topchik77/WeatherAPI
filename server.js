const express = require('express');
const path = require('path');
const routes = require('./src/routes/routes');

const app = express();

app.use(express.static(path.join(__dirname, 'src/frontend')));

app.use('/', routes);

app.use((req, res) => {
    res.status(404).sendFile('404.html', { root: 'src/frontend' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});