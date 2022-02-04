const ping = ( req, res ) => {
    res.json({ ping : 'ok ', userId: res.userId , email: res.email });
    res.end();

}

module.exports = {
    ping
};
