const { findById } = require('./findById');
const elastic = require('./search');
const {findUserById} = require("./findUserById");

const deleteElastic = (id) => {
    findById(id).then( async _id => {
        if( _id ) {
            await elastic.delete({id: _id})
            await elastic.indices.refresh({index: 'user'});
        }
    })
}

const deleteUser = (id) => {
    findUserById(id).then(async _id => {
        if(_id) {
            await elastic.delete({id: _id});
            await elastic.indices.refresh({index: 'user'});
        }
    })
}

module.exports = {
    deleteElastic,
    deleteElasticUser: deleteUser,
}
