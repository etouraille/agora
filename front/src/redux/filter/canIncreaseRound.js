import canEditDocument from "./canEditDocument";
import documentFilter from "./documentFilter";

const canIncreaseRound = ( id ) => {
    return ( state ) => {
        let canEditDoc = canEditDocument(id)(state);
        let touched = documentFilter(id)(state).document.touched;

        console.log( 'ced', canEditDoc);
        console.log('touched', touched);

        return canEditDoc && touched;
    }
}
export default canIncreaseRound;
