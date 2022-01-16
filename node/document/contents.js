const getDriver = require('./../neo/driver');
const Delta = require('quill-delta');
const contents = (id) => {

    // construit un arbre des documents qui ne sont pas complet au niveau du vote
    // TODO : maybe this is not correct the length should be minus one to take in account the last vote complete.
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH(d:Document) " +
        "WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[r:HAS_CHILDREN*]->(c:Document)" +
        "-[:HAS_PARENT]->(p:Document) " +
        "WHERE reduce(length=0, hasChildren in r | length + CASE NOT EXISTS (hasChildren.voteComplete) OR hasChildren.voteComplete = false WHEN true THEN 1 ELSE 0 END ) = size(r) " +
        "RETURN d, c, p , r , size(r) ";

    const appendChild = ( ret , d , cd , child, parent , link ) => {
        if( d > cd ) {
            if( parent && child &&parent.id === ret.document.id ) {
                let index = ret.children.findIndex(elem => elem.document.id === child.id );
                if( index === -1 ) {
                    ret.children.push({ document : child , link : link.properties, children : []});
                }
            }
            for ( let i in ret.children ) {
                appendChild(ret.children[i], d, cd + 1 , child, parent, link );
            }
        }
    }

    const result = session.run( query , {id});
    return new Promise( (resolve, reject) => {
        let ret = {};
        result.then( data => {
            data.records.forEach(elem => {
                const doc = elem.get(0).properties;
                const child = elem.get(1)? elem.get(1).properties: null;
                const parent = elem.get(2)? elem.get(2).properties: null;
                const links = elem.get(3)? elem.get(3): [];
                const depth = elem.get(4) ? elem.get(4).low : 0;
                if(!ret.document ) {
                    ret = { document : doc , children : [] };
                }
                if( child ) {
                    appendChild( ret , depth, 0 , child, parent , links.pop());
                }

            })
            resolve( ret );
        }, error => {
            reject( error );
        })
    })
}





const buildDoc = ( node ) => {

    // construit le document partiel
    if( node.document ) {

        let doc = new Delta(JSON.parse(node.document.body));
        let sortedChildren = node.children.sort((elem1, elem2) => {
            return (elem1.link.index < elem2.link.index ? -1 : 1);
        })

        let content = sortedChildren[0] ? doc.slice(0, sortedChildren[0].link.index) : doc;

        let deltaIndex = 0;

        sortedChildren.map((object, i) => {

            let current = JSON.parse(object.document.body);
            let afterIndex = object.link.length + object.link.index;
            let afterLength = doc.length() - (object.link.index + object.link.length);
            if (sortedChildren[i + 1]) {
                afterLength = sortedChildren[i + 1].link.index - (object.link.index + object.link.length);
            }
            const delta = buildDoc(object) //new Delta(current);
            content = content.concat(delta);
            content = content.concat(doc.slice(afterIndex, afterIndex + afterLength))
        });
        return content;
    }
}

module.exports = {
    contents,
    buildDoc,
}
