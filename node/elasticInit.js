const elastic = require('./elastic/search');

elastic.indices.exists({ index: 'document'}).then((documentExist) => {
    if (!documentExist.body) {
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
    }
})

elastic.indices.exists({index: 'user'}).then((exists) => {
    if (!exists.body) {
        elastic.indices.create({index: 'user'}).then(() => {
            elastic.indices.putMapping({
                index: 'user',
                body: {
                    properties: {
                        id: {
                            type: "text"
                        },
                        email: {
                            type: "text"
                        },
                        name: {
                            type: "text"
                        },
                        picture: {
                            type: "text"
                        },
                        friends: {
                            type: "nested",
                            properties: {
                                id: {
                                    type: "text"
                                },
                                email: {
                                    type: "text"
                                },
                                name: {
                                    type: "text"
                                },
                                picture: {
                                    type: "text"
                                },
                            }
                        }
                    }
                }
            }).then((success, error) => {
                console.log(success);
            })
        })
    }
})

