const { findParent } = require('./findParent');
const { documentGet } = require( './documentGet');
const { addNewDoc , append } = require('./../elastic/addElastic')
const { contents , buildDoc } = require('./contents');

const onReadyForVoteComplete = ( id ) => {

    findParent(id).then( pData  =>  {
        let parentId = pData.id;
        if ( parentId === id ) {
            documentGet(id).then(doc => {
                addNewDoc(doc).then( resolve => {
                    //console.log( resolve)
                }, error => {
                    console.log( 'error on ready for vote ========================))======', error );
                });
            })
        }
    })

}

const onVoteFailOrSuccess = (id) => {
    return new Promise( (resolve, reject ) => {
        findParent(id).then( pData => {
            let parentId = pData.id;
            contents(parentId).then(node => {
                let data = JSON.stringify(buildDoc(node));
                console.log(data);
                append(parentId, data ).then( success  => {
                    console.log( 'resolve =====');
                    resolve( success );
                }).catch( error => {
                    reject( error );
                });
            }).catch( error => {
                reject( error )
            })
        }).catch( error => {
            reject( error );
        })
    })
}

module.exports = {
    onReadyForVoteComplete,
    onVoteFailOrSuccess,
}
