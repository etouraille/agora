const { findById } = require('./findById');
const elastic = require('./search');

const deleteElastic = (id) => {
    findById(id).then( _id => {
        if( _id ) {
            elastic.delete({id: _id}).then(() => {

            })
        }
    })
}
module.exports = {
    deleteElastic,
}