const getDriver = require('./../neo/driver');

const {v4 : uuid } = require('uuid');

const create = ( req, res ) => {

    const username = res.username;
    const { title, body } = req.body;
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = 'MATCH (user: User ) WHERE user.login = $email ' +
        ' MERGE (user)-[r:CREATE]->(document : Document {title : $title , body : $body , id : $id })-[s:CREATE_BY]->(user)' +
        ' RETURN document'
        const result = session.run(
            query,
            {title : title , body : body , email: username , id : uuid()});

        result.then( data => {
            res.json( data.records[0].get(0));
            res.end();
            session.close();
            driver.close();
        }, error => {
            res.json(500, {reason : error});
            res.end();
            session.close();
            driver.close();

        })

    } finally {

    }
}

const get = ( req, res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = 'MATCH (document:Document) WHERE document.id = $id' +
            ' OPTIONAL MATCH (document)-[r:HAS_CHILDREN]->(children : Document )  ' +
            ' RETURN document, children';
        let result = session.run(query, {id : id });
        result.then(data => {
            if( data.records[0]) {
                const tab = { children : []};
                data.records.map((elem, index ) =>{
                    tab['document'] = elem.get(0).properties;
                    if(elem.get(1)) {
                        tab['children'].push( elem.get(1).properties );
                    }
                })
                res.json(tab);
                res.end();
            } else {
                res.json({});
                res.end();
            }
        },error => {
            res.json( 500, { reason : error });
            res.end();

        }).finally(() => {
            session.close();
            driver.close();
        })
    } finally {

    }

}

module.exports = {
    create,
    get,
};