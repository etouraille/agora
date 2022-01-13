import documentFilter from "./documentFilter";
import hasSubscribedFilter from "./hasSubscribedFilter";
import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";

const canDisplayDiffFilter = ( id ) => {
    return ( state ) => {
        let doc = documentFilter(id)(state);
        let hasSubscribed = hasSubscribedFilter(id)(state);
        let oneCanDisplay = false;
        if( doc && doc.children ) {
            doc.children.forEach(elem => {
                let rfv = readyForVoteSubscribedFilter(elem.child.id)(state);
                if (rfv.isOwner || (!rfv.isOwner && rfv.isReadyForVote)) {
                    oneCanDisplay = true;
                }
            })
        }
        return hasSubscribed && doc && doc.children && doc.children.length > 0 && oneCanDisplay;
    }
}
export default canDisplayDiffFilter;
