const ping = ( req, res ) => {
    res.json({ ping : 'ok '});
    res.end();

}

module.exports = {
    ping
};