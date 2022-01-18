const getDriver = require('./../neo/driver');

const { sendMessageToSubscribers } = require('./../mercure/mercure');

const { v4 : uuid } = require('uuid');
const {contents, buildDoc} = require("../document/contents");

const getUser = ( req, res ) => {


    const id = req.params.id;

    if(!id ) {
        return res.json(404, {reason: 'No record for id : ' + id}).end();
    }

    const query = "MATCH (u:User) WHERE u.id = $id " +
        "OPTIONAL MATCH (u)-[vf:VOTE_FOR]->(d1:Document) " +
        "WHERE vf.against = false " +
        "OPTIONAL MATCH (u)-[va:VOTE_FOR]->(d2:Document)  " +
        "WHERE va.against = true " +
        "OPTIONAL MATCH (u)-[s:HAS_SUBSCRIBE_TO]->(d:Document) WHERE NOT ((d)-[:HAS_PARENT]->(:Document)) " +
        "RETURN u, count(vf) as vote_for, count(va) as vote_against, d ";



    const driver = getDriver();
    const session = driver.session();

    let result = session.run(query, {id});
    result.then(data => {
        let singleRecord = data.records[0];
        if (!singleRecord) {
            return res.json(404, {reason: 'No record for id : ' + id}).end();
        } else {
            let ret = {};
            let { name, picture } = singleRecord.get(0).properties;
            let vf = singleRecord.get(1) ? singleRecord.get(1).low: 0;
            let va = singleRecord.get(2) ? singleRecord.get(2).low: 0;
            ret = {name, picture, vf, va, subscribedDocs : []};
            return Promise.all(data.records.map(item => {
                let { id, title } = item.get(3).properties;
                return contents(id).then(node => {
                    let content = buildDoc(node);
                    return {id, title, content };
                })

            })).then((data) => {
                ret.subscribedDocs = data;
                return ret;
            }).then((ret) => {
                console.log(ret);
                res.status(200).json(ret);
            })

        }
    }).catch((err) => {
        console.log( err);
        res.json(500, {reason : err }).end();
    }).finally(() => {
        session.close();
        driver.close();
    });
}
module.exports = {
    getUser,
}
