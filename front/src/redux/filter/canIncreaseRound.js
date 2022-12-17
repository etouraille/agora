import canEditDocument from "./canEditDocument";
import documentFilter from "./documentFilter";

const canIncreaseRound = ( id ) => {
    return ( state ) => {
        let elem = state.readyForVote.find(elem => elem.id === id);
        let max = null;
        let min = null;
        if(elem) {
            max = elem.data.map(elem => elem.round).max();
            min = elem.data.map(elem => elem.round).min();
        }

        let canEditDoc = canEditDocument(id)(state);
        let touched = documentFilter(id)(state).document.touched;
        console.log( 'canEdit', canEditDoc, touched, min, max );
        return canEditDoc && (( min === max && min === 0 ) || touched);
    }
}
export default canIncreaseRound;
