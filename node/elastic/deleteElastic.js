const { findById } = require('./findById');
const elastic = require('./search');
const {findUserById} = require("./findUserById");

const deleteElastic = (id) => {
    findById(id).then( async (_id) => {
        if( _id ) {
            console.log(_id);
            await elastic.delete({id: _id, index : 'document'})
            await elastic.indices.refresh({index: 'document'});
        }
    })
}

const deleteUser = (id) => {
    findUserById(id).then(async _id => {
        console.log(_id);
        if(_id) {
            await elastic.delete({id: _id, index: 'user'});
            await elastic.indices.refresh({index: 'user'});
        }
    })
}

module.exports = {
    deleteElastic,
    deleteElasticUser: deleteUser,
}
