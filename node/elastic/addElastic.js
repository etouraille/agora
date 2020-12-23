const elastic = require('./search');
const { findById } = require('./findById');

const addNewDoc = ( doc ) => {
    return new Promise( ( resolve, reject ) => {
        elastic.index({
            index: 'document',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                title: doc.title,
                id: doc.id,
                quotations : [{ value : doc.body }]
            }
        }).then( res => {
            elastic.indices.refresh({ index : 'document'}).then(() => {
                resolve( res );
            })

        },error => {
            reject( error );
        })
    })
}

const append = (id, data ) => {

    return new Promise( (resolve , reject ) => {
        findById(id).then(_id  => {
            const appended = {
                field: "quotations",
                value: [{value: data}]
            }
            elastic.update({
                index: 'document',
                id: _id,
                body: {
                    script: {
                        source : "ctx._source.quotations.add(params.quotation)",
                        params: {quotation: {value: data}}
                    },
                }
            }).then(resp => {
                elastic.indices.refresh({ index : 'document'}).then(() => {
                    console.log( resp );
                })

            }, err => {
                throw err;
                //console.log(err.body.error );
            })
        })
    })
}

module.exports = {
    addNewDoc,
    append,
}