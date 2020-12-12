const ping = ( req, res ) => {
    res.json({ ping : 'ok ', user: res.username });
    res.end();

}

module.exports = {
    ping
};