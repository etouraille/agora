'use strict'

const { Client } = require('@elastic/elasticsearch');

const elastic = new Client({ node : 'http://elastic:9200'});

module.exports  = elastic;