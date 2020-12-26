const elastic = require('./elastic/search');

elastic.indices.refresh({ index : 'document'}).then( response => {
    console.log( response );
})