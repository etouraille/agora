const elastic = require('./elastic/search');

elastic.indices.delete({index : 'document'}).then(() => {
    elastic.indices.create( {index: 'document'}).then(() => {
        elastic.indices.putMapping({
            index: 'document',
            //type: 'staff',
            body: {
                properties: {
                    title: {
                        type: "text"
                    },
                    id : {
                        type : "text"
                    },
                    quotations: {
                        type: "nested",
                        properties: {
                            value: {
                                type: "text"
                            }
                        }
                    }
                }
            }
        }).then( (success , error) => {
            console.log(success );
        })
    })
})