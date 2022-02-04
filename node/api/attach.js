const getDriver = require('../neo/driver');

const { v4 : uuid } = require('uuid');

const postAttach = (req, res ) => {

    const driver = getDriver();
    const session = driver.session();

    const {id,data} = req.body;

    // TODO before attachment check that user has subscribed to the doc.

    const query = "" +
        "MATCH(d:Document) " +
        "WHERE d.id = $id " +
        "MERGE (d)-[r:HAS_ATTACHMENT {by: $userId}]->(a:Attachment {type: $type, link: $link, uuid : $uuid, text : $text}) " +
        "RETURN r, a";


    const result = session.run( query , {id, userId: res.userId, type : data.type, link: data.link, text: data.text, uuid: uuid() });
    result.then(data => {
        res.status(200).json({ ...data.records[0].get(0).properties, ...data.records[0].get(1).properties});
    }).finally(() => {
        session.close();
        driver.close()
    });

}





const getAttach = ( req, res ) => {

    const id = req.params.id;

    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (d:Document)-[r:HAS_ATTACHMENT]->(a:Attachment) " +
        "WHERE d.id = $id " +
        "RETURN d, r, a ";

    const result = session.run( query, {id})
    let ret = [];
    result.then((data) => {
        data.records.forEach(elem => {
            let attachment = elem.get(2).properties;
            ret.push({ ...attachment, ...elem.get(1).properties});
        })
        res.status(200).json(ret)
    }).finally(() => {
        session.close();
        driver.close();
    })
}


const deleteAttach = ( req, res ) => {

    const id = req.params.id;

    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (d:Document)->[r:HAS_ATTACHMENT]->(a:Attachment) " +
        "WHERE a.id = $id" +
        "DELETE r, a ";

    const result = session.run( query, {id})
    result.then(data => {
        res.status(200).json({deleted: true})
    }).finally(() => {
        session.close();
        driver.close();
    })
}

module.exports = {
    postAttach,
    getAttach,
    deleteAttach,
}
