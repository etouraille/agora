const getDriver = require('../neo/driver');
const { sendInvite } = require('../notification/notification')
const { sendMessage } = require('../mercure/mercure')
const {contents, buildDoc} = require("../document/contents");
const neo4j = require('neo4j-driver');

const home = ( req, res ) => {

    let { page , per_page } = req.body;

    page = page ? page : 1;
    per_page = per_page ? per_page : 9;

    const driver = getDriver();
    const session = driver.session();

    let  query = "MATCH (d:Document) " +
        "WHERE NOT (d)-[:HAS_PARENT]->(:Document) AND ( d.private = false OR d.private IS NULL )" +
        "RETURN d " +
        "ORDER BY d.createdAt, d.title ASC SKIP $skip " +
        "LIMIT $per_page ";

    //TODO il some elements have the same created at, result might appear more than once.
    //https://stackoverflow.com/questions/65873569/neo4j-pagination-return-same-results-even-when-skip-and-order-by-are-specified

    let ret = [];

    let _params = { per_page: neo4j.int(per_page),  skip : neo4j.int((page-1) * per_page) };
    let result = session.run(query, _params);

    console.log(_params);

    result.then( data => {
        return Promise.all(data.records.map((elem, index ) => {
            let { id, title } = elem.get(0).properties;

            return contents(id).then(node => {
                let content = buildDoc(node);
                // TODO put a date in subscription
                // TODO FILTER BY THE MOST RECENT USERS
                query = 'MATCH (u: User)-[r:HAS_SUBSCRIBE_TO]->(d:Document) WHERE d.id = $id RETURN u, r, d ';
                let users = [];
                let _session = driver.session();
                return _session.run(query, {id}).then(data => {
                    data.records.forEach(elem => {
                        let { login, name, id } = elem.get(0).properties;
                        users.push({login, name, id });
                    })
                    return ret.push({content, users, title , id });
                }).catch(err => {
                    console.log( err);
                }).finally(() => _session.close())
            })
        }))
    }).then(() => {
        res.status(200).json(ret);
    }).catch(err => {
        console.log(err);
        session.close();
        driver.close();
        res.status(500).json({reason: err})
    }).finally(() => {
        session.close();
        driver.close();

    })
}


module.exports = {
    home,
}
