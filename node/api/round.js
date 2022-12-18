const getDriver = require('./../neo/driver');
const {voteComplete, voteFailure} = require("../vote/voteComplete");
const {sendNotificationNewRound} = require("../notification/notification");
const {sendMessageToEditors} = require("../mercure/mercure");

const putRound = ( req, res ) => {

    const { id , userId } = req.body;

    const driver = getDriver();

    console.log(id);

    // je peux editer le texte quand le round = 0 pour moi ou que le round > 0 pour moi et que le vote est complet mais en échec
    // je peux incrémenter le round quand je peux editer le text et que le document a été modifié
    // je peux voter quand le round vient d'être incrémenté et qu'on a passs les readyForVote à null round meme valeur pour tout le monde et round > 0
    // quand j'incrémente le round j'envoie une notif : {user} A FAIT UN APPELLE AU VOTE POUR L'AMENDEMENT {DOC}, VOUS POUVEZ VOTER
    // quand je vote et que le vote est en echec : notif, le vote est un échec vous pouvez de nouveau MODFIFER [L'AMENDEMENT](DOC)

    // TODO : 2 version possible soit on incrémente le round user par user et on peut editer le texte tant que le round n'est pas incrémenté
    // TODO : soit le premier qui incrémente le round l'incrémente pour tout le monde.
    // TODO : I choose here to increment round globaly.
    let query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User ) WHERE d.id = $id AND u.id = $userId " +
        "OPTIONAL MATCH (d)-[ra:FOR_EDIT_BY]->(v:User) " +
        " WITH count(ra) as _count, d, r, u, ra , collect(ra) as _ras " +
        "WITH max(ra.round) as _maxRound , min(ra.round) as _minRound,  _count , ra , r , d , _ras " +
        "WITH reduce(against=0, forEditBy in collect(ra) | against + CASE forEditBy.readyForVote = false WHEN true THEN 1 ELSE 0 END ) as _against,  " +
        "reduce(for=0, forEditBy in collect(ra) | for + CASE forEditBy.readyForVote = true WHEN true THEN 1 ELSE 0 END ) as _for," +
        "reduce(minRound=0, forEditBy in collect(ra) | minRound + CASE forEditBy.rank = _minRound  WHEN true THEN 1 ELSE 0 END ) as _countMinRound," +
        "reduce(maxRound=0, forEditBy in collect(ra) | maxRound + CASE forEditBy.rank = _maxRound  WHEN true THEN 1 ELSE 0 END ) as _countMaxRound, " +
        " _maxRound, _minRound , r , ra , d , _count , _ras " +
        "RETURN _maxRound, _minRound, r.round, _against, _for, _countMaxRound, _countMinRound , count(_ras) , d";

    query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id AND u.id = $userId " +
        "MATCH (d)-[ra:FOR_EDIT_BY]->(:User) " +
        "RETURN d, ra , r";



    let _session = driver.session();

    _session.run(query, {id, userId}).then(data => {
        let ra = [];
        data.records.forEach(elem => {
            ra.push(elem.get(1).properties);
        })
        let currentRound = typeof data.records[0].get(2).properties.round.low === 'number' ? data.records[0].get(2).properties.round.low : parseInt(data.records[0].get(2).properties.round);
        let maxRound = ra.map(elem => typeof elem.round.low === 'number' ? elem.round.low : parseInt(elem.round)).max();
        let minRound = ra.map(elem => typeof elem.round.low === 'number' ? elem.round.low : parseInt(elem.round)).min();
        let _against = ra.reduce((a, elem) => (elem.readyForVote === false ? a + 1 : a), 0);
        let _for = ra.reduce((a, elem) => (elem.readyForVote === true ? a + 1 : a), 0);
        let _voters = ra.length;
        let documentTouched = data.records[0].get(0).properties.touched;

        console.log(data.records[0].get(2));
        // on increment le round si
        // ( minRound == maxRound et le vote n'est pas complet et tout le monde a voté _for + _against === countMaxRoudn + countMinRound)
        // dans ce cas on efface tout les vote.
        // ( minRoud < maxRound et currenRound = minRound )

        // je peux editer le texte quand le round = 0 ou que le round > 0 et que le vote est complete mais en echec && quand le vote n'est pas un succès.
        // Je peux incrémenter le round quand je peux editer le text et que le document a été modifié.


        let _type = 'consensus';
        let _deleteVoteComplete = false;
        let _currentRound;
        console.log(documentTouched);
        console.log(currentRound);
        //if (countMinRound + countMaxRound !== _voters) {
        //    return res.status(500).json({reason: 'Database corrupted'});
        //}

        console.log(minRound, maxRound, _for, _against, _voters , voteFailure(_for, _against, _voters  , _type ));
        if (currentRound === 0) {
            _currentRound = currentRound + 1;
        } else if (minRound === maxRound
            && minRound > 0
            && voteFailure(_for, _against, _voters  , _type )
            && documentTouched
        ) {
            _currentRound = minRound + 1;
            _deleteVoteComplete = true;

        // sous entends qu'on a déja modifié le round mais qu'il n'a pas la meme valeur pour tout le monde
        } /*else if( minRound < maxRound
            && minRound > 0
            && currentRound === minRound
            && documentTouched
        ) {
            _currentRound = currentRound + 1;
        } */ else {
            return res.status(405).json({reason: 'not allowed to increase round'})
        }

        query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id AND u.id = $userId " +
            "SET r.round = $_currentRound REMOVE r.readyForVote  ";
        let session = driver.session();
        return session.run(query, { id, userId, _currentRound: parseInt(_currentRound)}).then((data) => {
            if(_deleteVoteComplete) {
                let _sess = driver.session();
                // SEND NOTIF FOR A NEW ROUND.
                sendNotificationNewRound(id, res.userId);
                //return _sess.run("MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id " +
                //    "REMOVE r.voteComplete ", {id}).then()
                //.finally(() => _sess.close());
                return _sess.run("MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id " +
                    "REMOVE r.readyForVote SET r.round = $_currentRound REMOVE d.touched ",
                    {id, _currentRound: parseInt(_currentRound)}).then(
                    () => sendMessageToEditors(id, {id, user: res.userId, subject: 'documentUnTouched', currentRound: parseInt(_currentRound)})
                )
                    .finally(() => _sess.close());
            } else {
                return null;
            }
        }).then(() => {
            res.status(200).json({ round: _currentRound, delete: _deleteVoteComplete});
        }).finally(() => session.close());

    }).catch(error => {
        console.log(error);
        res.status(500).json({error});
    }).finally(() => {
        _session.close();
        driver.close();
    })
}

/*
const addRound = (id) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id " +
        "SET r.round = r.round + 1 " +
        "RETURN r, u ";
    return new Promise((resolve, reject) => {
        session.run(query, {id}).then(data => {
            let ret = [];
            if( data.records.length > 0 ) {
                data.records.forEach( (elem , index) => {
                    ret.push({
                        user : elem.get(1).properties.login,
                        readyForVote : elem.get(0).properties.readyForVote,
                        invitedBy : elem.get(0).properties.invited,
                        round: elem.get(0).properties.round,
                    })
                })
            }
            resolve(ret);
        }).catch(err => {
            reject(err);
        })
        .finally(() => {
            session.close();
            driver.close();
        })
    })
}
*/
module.exports = {
    putRound,
    //addRound,
}
