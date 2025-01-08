require('dotenv').config();
require('module-alias/register');
const express = require('express');
const path = require('path');

const app = require('@src/app');
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
