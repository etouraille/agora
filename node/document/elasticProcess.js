const { findParent } = require('./findParent');
const { documentGet } = require( './documentGet');
const { addNewDoc , append } = require('./../elastic/addElastic')
const { contents , buildDoc } = require('./contents');

const onReadyForVoteComplete = ( id ) => {

    findParent(id).then( parentId =>  {
        if ( parentId === id ) {
            documentGet(id).then(doc => {
                addNewDoc(doc).then( resolve => {
                    //console.log( resolve)
                }, error => {
                    console.log( error );
                });
            })
        }
    })

}

const onVoteFailOrSuccess = (id) => {
    findParent(id).then( parentId => {
        console.log( parentId , id );
        contents(parentId).then(node => {
            let data = JSON.stringify(buildDoc(node));
            append(parentId, data ).then(resolve => {
                console.log( resolve );
            })
        })
    })
}

module.exports = {
    onReadyForVoteComplete,
    onVoteFailOrSuccess,
}