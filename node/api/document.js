const getDriver = require('./../neo/driver');

const {v4 : uuid } = require('uuid');
const { documentDelete } = require('./../document/documentDelete');

const create = ( req, res ) => {

    const username = res.username;
    const { title, body } = req.body;
    const driver = getDriver();
    const session = driver.session();


        const query = '' +
        'MATCH (user: User ) WHERE user.login = $email ' +
        'MERGE (user)-[r:CREATE]->' +
        '(document : Document {title : $title , body : $body , id : $id , created_at : localdatetime()})' +
        '-[s:CREATE_BY]->(user) ' +
        'MERGE (document)-[p:FOR_EDIT_BY { invited : $me, readyForVote : false  }]->(user) ' +
        "MERGE (document)-[:SUBSCRIBED_BY]->(user)-[:HAS_SUBSCRIBE_TO]->(document) " +
        'RETURN document'
        const result = session.run(
            query,
            {title : title , body : body , email: username , id : uuid(), me : username });

        result.then( data => {
            res.json( data.records[0].get(0).properties );
            res.end();

        }, error => {
            console.log( error );
            res.json(500, {reason : error});
            res.end();

        }).finally( () => {
            session.close();
            driver.close();

        })


}

const get = ( req, res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = 'MATCH (document:Document) WHERE document.id = $id' +
            ' OPTIONAL MATCH (document)-[relation:HAS_CHILDREN]->(children : Document )  ' +
            ' WHERE NOT EXISTS(relation.voteComplete) OR relation.voteComplete = false  ' +
            ' OPTIONAL MATCH (document)-[parentRelation:HAS_PARENT*]->(parent : Document)' +
            ' RETURN document, children, relation, parent, parentRelation , size(parentRelation) as n' +
            ' ORDER BY n ASC ';
        let result = session.run(query, {id : id });

        const parseNested = ( node , depth, currentDepth, doc, link ) => {
            if( depth > currentDepth ) {
                if (!node.parent) {
                    node.parent = { document : null, link : null, parent : null };
                }
                return parseNested(node.parent, depth, currentDepth + 1, doc, link );
            } else {
                 node.document = doc;
                 node.link = link;
                 return node;
            }
        }

        result.then(data => {
            if( data.records[0]) {
                const tab = { children : []};
                data.records.map((elem, index ) =>{
                    tab['document'] = elem.get(0).properties;
                    if(elem.get(1)) {
                        tab['children'].push( {child  : elem.get(1).properties , link :  elem.get(2).properties });
                    }
                    tab['parentLink'] = elem.get(4) ?  elem.get(4).properties: null;
                    let depth = elem.get(5)?elem.get(5).low: 1;
                    if(!tab['parent']) {
                        tab['parent'] = {
                            document : elem.get(3) ? elem.get(3).properties : null,
                            link : elem.get(4) ? elem.get(4).pop().properties : null,
                            parent : null,
                        }
                    } else {
                        let node = parseNested(
                            tab['parent'],
                            depth, 1,
                            elem.get(3) ? elem.get(3).properties : null,
                            elem.get(4) ? elem.get(4).pop().properties : null);


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

const deleteDocument = ( req, res ) => {
    documentDelete(req.params.id ).then( result => {
        return res.json({success : true }).end();
    }, error => {
        console.log( error );
        return res.json(500, {reason : error }).end();
    })
}

module.exports = {
    create,
    get,
    deleteDocument,
};
