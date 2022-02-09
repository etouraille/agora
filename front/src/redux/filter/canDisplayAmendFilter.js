import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import documentFilter from "./documentFilter";

const canDisplayAmendFilter = ( id ) => {
    return ( state ) => {
        let doc = documentFilter(id)(state);
        let isRoot = doc.parentLink === null;
        let rfv = readyForVoteSubscribedFilter(id)(state);
        console.log(rfv);
        console.log(isRoot);
        let vote = voteFilter(id)( state );
        return rfv.hasSubscribed && (( rfv.isReadyForVote &&  vote &&  vote.fail ) || isRoot )
    }
}
export default canDisplayAmendFilter;
