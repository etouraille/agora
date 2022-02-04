import voteFailure from "../../utils/voteFailure";

const canEditDocument = (id) => {
    return (state) => {
        let userId = state.login.userId;
        let elem = state.readyForVote.find(elem => elem.id === id);
        let canEdit = false;
        console.log( elem );

        if(elem) {
            let _for = elem.data.map(elem => elem.readyForVote).reduce((a,b)=> (b === true ? a + 1: a), 0);
            let _against = elem.data.map(elem => elem.readyForVote).reduce((a,b)=> (b === false ? a + 1: a), 0);
            let _minRound = elem.data.map(elem => elem?.round).min();
            let _maxRound = elem.data.map(elem => elem?.round).max();
            let myRound = elem.data.find(elem => elem.user === userId)?.round;
            canEdit = myRound === 0 || (myRound > 0 && voteFailure(_for, _against, elem.data.length, 'consensus'));
            console.log('here ===========', myRound,  voteFailure(_for, _against, elem.data.length, 'consensus'));

        }
        return canEdit;
    }
}
export default canEditDocument;


// je peux editer le texte quand le round = 0 pour moi ou que le round > 0 pour moi et que le vote est complet mais en échec
// je peux incrémenter le round quand je peux editer le text et que le document a été modifié
// je peux voter quand le round vient d'être incrémenté et qu'on a passs les readyForVote à null round meme valeur pour tout le monde et round > 0
// quand j'incrémente le round j'envoie une notif : {user} A FAIT UN APPELLE AU VOTE POUR L'AMENDEMENT {DOC}, VOUS POUVEZ VOTER
// quand je vote et que le vote est en echec : notif, le vote est un échec vous pouvez de nouveau MODFIFER [L'AMENDEMENT](DOC)
