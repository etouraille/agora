
const getDriver = require('./../neo/driver');

const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const ShareDB = require('sharedb');

const var_dump = require('var_dump');
/**
 * By Default Sharedb uses JSON0 OT type.
 * To Make it compatible with our quill editor.
 * We are using this npm package called rich-text
 * which is based on quill delta
 */
ShareDB.types.register(require('rich-text').type);

const shareDBServer = new ShareDB();
const connection = shareDBServer.connect();

const { stringify , Flatted } = require('flatted')

const Delta = require('quill-delta');

let ops = {};

const save = ( id ) => {
    if( ops[id] ) {
        const driver = getDriver();
        const session = driver.session();
        const query = "MATCH (d:Document ) WHERE d.id = $id " +
            "SET d.body = $body";
        let result = session.run( query , { id : id , body : JSON.stringify(ops[id])});
        result.then( data => {

        }, error => {
            throw error;
        }).finally( () => {
            session.close();
            driver.close();
        })
    }


}

const socketDocument = (ws) => {
    // For transport we are using a ws JSON stream for communication
    // that can read and write js objects.

    ws.onmessage = ( message ) => {
        const data = JSON.parse( message.data );
        if( data.a === 'hs' && data.id && data.id.match(/save/)) {
            const id = data.id.match(/save-(.*)$/)[1];
            if (id) {
                save(id);
            }
        }
        if(data.a === 'hs' && data.id && ! data.id.match(/save/)) {
            const doc = connection.get('documents', data.id );
            doc.fetch(function (err) {
                if (err) throw err;
                if (doc.type === null) {
                    /**
                     * If there is no document with id "firstDocument" in memory
                     * we are creating it and then starting up our ws server
                     */

                    const driver = getDriver();
                    const session = driver.session();
                    const query = 'MATCH (d:Document) WHERE d.id = $id RETURN d';
                    const result = session.run(query , {id : data.id });
                    result.then( record  => {
                        if( record.records[0]) {
                            doc.create(JSON.parse(record.records[0].get(0).properties.body ), 'rich-text', () => {

                            });
                        } else {
                            doc.create([{ insert: '' }], 'rich-text', () => {
                            });
                        }
                    },error => {
                        throw error;
                    }).finally(() => {
                        session.close();
                        driver.close();
                    })
                    return;
                }
            });
        }
    }

    const jsonStream = new WebSocketJSONStream(ws);
    shareDBServer.listen(jsonStream);
}
shareDBServer.use('commit', ( request, next ) => {
    const id = request.id;
    let data = null;
    if( request.backend.db.docs.documents && request.backend.db.docs.documents[id] ) {
        data = request.backend.db.docs.documents[id].data.ops;
    }
    let newOps = [];
    if( request.op.op  && data ) {
        console.log( JSON.stringify(request.op.op));
        const delta = new Delta( data );
        const res = delta.compose(request.op.op );
        ops[id] = res;
        console.log( ops );
    }
    next();
});

module.exports = {
    socketDocument,
}