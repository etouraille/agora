
const getDriver = require('./../neo/driver');
const { readyForVote } = require('./../vote/readyForVote');
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

const shareDBServer = new ShareDB({
    db: require('sharedb-mongo')('mongodb://mongo/queel')
});

const connection = shareDBServer.connect();

const { stringify , Flatted } = require('flatted')

const Delta = require('quill-delta');
const {sendMessageToSubscribers, sendMessageToEditors} = require("../mercure/mercure");

let ops = {};

const save = ( id , user) => {

    const doc = connection.get('documents', id);
    doc.fetch(function(err) {

        const driver = getDriver();
        const session = driver.session();
        const query = "MATCH (d:Document ) WHERE d.id = $id " +
            "SET d.body = $body " +
            "SET d.touched = true ";
        let result = session.run( query , { id : id , body : JSON.stringify(doc.data)});
        result.then( data => {
            const doc = connection.get('documents', id );
            //doc.submitOp(ops[id], {source: { user}});
        }, error => {
            throw error;
        }).finally( () => {
            session.close();
            driver.close();
        })
    })


}

const socketDocument = (ws) => {
    // For transport we are using a ws JSON stream for communication
    // that can read and write js objects.

    ws.onmessage = ( message ) => {
        const data = JSON.parse( message.data );
        console.log( data );
        if( data.a === 'hs' && data.id && data.id.match(/save/)) {
            const id = data.id.match(/save-(.*)---(.*)$/)[1];
            const user = data.id.match(/save-(.*)---(.*)$/)[2];
            if (id && user ) {
                readyForVote(id, user ).then(rfv => {
                    console.log(rfv);
                    if (rfv.isOwner &&  ! rfv.isReadyForVote && rfv.canBeEdited ) {
                        save(id, user);
                        sendMessageToEditors(id, {id, user, subject: 'documentTouched'});
                    }
                })

            }
        }
        if(data.a === 'hs' && data.id && ! data.id.match(/save/)) {
            const id = data.id.match(/current-(.*)---(.*)$/)[1];
            const user = data.id.match(/current-(.*)---(.*)$/)[2];

            console.log(id);
            console.log(user);

            const doc = connection.get('documents', id);

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
                    const result = session.run(query , {id : id });
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
                } else {
                   // if(ops[id]) doc.submitOp(ops[id], {source: {user}});
                }
            });
        }
    }

    const jsonStream = new WebSocketJSONStream(ws);
    shareDBServer.listen(jsonStream);
}
/*
shareDBServer.use('commit', ( request, next ) => {
    console.log('request id', request.id);
    const id = request.id;
    let data = null;
    if( request.backend.db.docs.documents && request.backend.db.docs.documents[id] ) {
        data = request.backend.db.docs.documents[id].data.ops;
    }
    if( request.op.op  && data ) {
        const delta = new Delta( data );
        const res = delta.compose(request.op.op );
        ops[id] = res;
        console.log(ops);
    }
    next();
});
*/
module.exports = {
    socketDocument,
}
