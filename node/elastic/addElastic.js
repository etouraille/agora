const elastic = require('./search');
const { findById } = require('./findById');

const addNewDoc = ( doc ) => {
    return new Promise( ( resolve, reject ) => {
        elastic.index({
            index: 'document',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            id: doc.id,
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

const addNewUser = async (user, invitedBy) => {
    const params = {
        index: 'user',
        id: user.id,
        body: {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            friends : []
        }
    };
    if( invitedBy) {
        params.body.friends.push({
            id: invitedBy.id,
            email: invitedBy.email,
            name: invitedBy.name
        });
        //TODO add in friend indices.
    }
    try {
        await elastic.index(params);
        await elastic.indices.refresh({index: 'user'})
    } catch(e) {
        console.log(e);
    }
}

const updateUser = async (id, user ) => {
    let _id = await findById(id, 'user');
    console.log(_id, 'ELASTIC USER ID', user);
    if (_id) {
        await elastic.update({index: 'user', id: _id, body: { doc: user }});
        await elastic.indices.refresh({index: 'user'});
    }
}

const append = (id, data ) => {

    return new Promise( (resolve , reject ) => {
        findById(id).then(_id  => {
            if(_id) {
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
                        resolve( true );
                    }, error => {
                        reject ( error );
                    })

                }, err => {
                    reject( err);
                    //throw err;
                    //console.log(err.body.error );
                })
            } else {
                reject('no index for the current object return by find');
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    addNewDoc,
    addNewUser,
    updateUser,
    append,
}
