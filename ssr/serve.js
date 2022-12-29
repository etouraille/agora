const express = require('express');
const {ssr} = require('./ssr');

const app = express();

app.get('*', async (req, res, next) => {
    const {html} = await ssr(`https://queel.fr${req.url}`);
    // Add Server-Timing! See https://w3c.github.io/server-timing/.
    return res.status(200).send(html); // Serve prerendered page as response.
});

app.listen(8090, () => console.log('Server started. Press Ctrl+C to quit'));