CALL apoc.trigger.remove('test-rel-trigger') yield name return name;
CALL apoc.trigger.add('test-rel-trigger',
    "UNWIND keys($assignedRelationshipProperties) AS key
UNWIND $assignedRelationshipProperties[key] AS map
WITH map WHERE type(map.relationship) = 'VOTE_FOR'
WITH ID(map.relationship) AS id
CALL apoc.load.json('http://node:8000/trigger/' + id ) YIELD value RETURN value"
, {phase:'after'})
