const neo4j = require('neo4j-driver');

const getDriver = () => {

    return  neo4j.driver('bolt://neo:7687', neo4j.auth.basic('neo4j', 'b1otope'));
};

module.exports = getDriver;