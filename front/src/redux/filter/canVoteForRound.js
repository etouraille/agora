const canVoteForRound = (id) => {
    return (state) => {
        let elem = state.readyForVote.find( elem => elem.id === id);
        let canVote = false;
        if (elem) {
            let min = elem.data.map(elem => elem.round).min();
            let max = elem.data.map(elem => elem.round).max();
            let countReadyForVote = elem.data.reduce((a,b) => (b.readyForVote === true || b.readyForVote === false ? a + 1 : a), 0);
            console.log(min, max, countReadyForVote, elem.data.length);
            canVote = min === max && min > 0 && countReadyForVote < elem.data.length;
        }
        return canVote;
    }
}
export default canVoteForRound;

// je peux editer le texte quand le round = 0 pour moi ou que le round > 0 pour moi et que le vote est complet mais en échec
// je peux incrémenter le round quand je peux editer le text et que le document a été modifié
// je peux voter quand le round vient d'être incrémenté et qu'on a passs les readyForVote à null round meme valeur pour tout le monde et round > 0
// quand j'incrémente le round j'envoie une notif : {user} A FAIT UN APPELLE AU VOTE POUR L'AMENDEMENT {DOC}, VOUS POUVEZ VOTER
// quand je vote et que le vote est en echec : notif, le vote est un échec vous pouvez de nouveau MODFIFER [L'AMENDEMENT](DOC)
