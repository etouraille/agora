const Delta = require("quill-delta");
const getDriver = require('./../neo/driver');
const quillMerge = ( parentBody, childBody, index, length ) => {
    const parent = new Delta(JSON.parse(parentBody));
    const child = new Delta( JSON.parse(childBody) );
    const before = parent.slice(0, index );
    const content = child;
    const after = parent.slice(index + length , parent.length());
    let ret = before.concat(content );
    ret = ret.concat( after );
    return ret;
}

const mergeApply = (parentId , id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:HAS_CHILDREN]->(c:Document) " +
        "WHERE NOT EXISTS(r.voteComplete) AND d.id = $parentId " +
        "RETURN d, c , r " +
        "ORDER BY r.index ASC ";
    let result = session.run( query , {parentId });
    return new Promise( (resolve , reject ) => {

        result.then(data => {
            let ret = new Delta([]);
            let delta = 0;
            let res = [];
            data.records.forEach( (elem , i) => {
                const parentBody = elem.get(0).properties.body;
                const childBody = elem.get( 1).properties.body;
                const childId = elem.get(1).properties.id;
                const index = elem.get(2).properties.index;
                const length = elem.get(2).properties.length;

                if( childId === id ) {
                    const parent = new Delta(JSON.parse(parentBody));
                    const child = new Delta( JSON.parse(childBody) );
                    const before = parent.slice(0, index );
                    const content = child;
                    const after = parent.slice(index + length , parent.length());
                    ret = before.concat(content );
                    ret = ret.concat( after );
                    delta = child.length() - parent.slice(index, index + length ).length();
                } else {
                    if( delta ) {
                        res.push({id: childId, index: index + delta, length: length});
                    }
                }
            })
            let query = "" +
                "MATCH ( p:Document )-[cr:HAS_CHILDREN]->(c:Document)-[pr:HAS_PARENT]->(d) " +
                "WHERE p.id = $parentId AND c.id = $id " +
                "OPTIONAL MATCH (:User)-[vf:VOTE_FOR]->(p) " +
                "SET p.body = $newBody " +
                "SET cr.voteComplete = true " +
                "SET pr.voteComplete = true " +
                "DELETE vf ";
            session.run( query , {parentId , id , newBody : JSON.stringify(ret)}).then(() => {
                res.forEach( elem => {
                    let query = "MATCH(c:Document)-[r:HAS_PARENT]->(p:Document)-[cr:HAS_CHILDREN]->(c) " +
                        "WHERE c.id = $id AND p.id = $parentId " +
                        "SET r.index = $index ";
                    session.run(query , { id, parentId , index : elem.index }).then(() => {
                        resolve( true );
                    }, error => {
                        reject( error );
                    })
                })
                if( res.length === 0 ) {
                    resolve( true );
                }
            },error => {
                reject( error );
            })
        }, error => {
            reject( error );
        })
    })
}
module.exports = {
    quillMerge,
    mergeApply,
}