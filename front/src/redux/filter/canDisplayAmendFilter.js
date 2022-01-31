import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import documentFilter from "./documentFilter";

const canDisplayAmendFilter = ( id ) => {
    return ( state ) => {
        let doc = documentFilter(id)(state);
        let isRoot = doc.parentLink === null;
        let rfv = readyForVoteSubscribedFilter(id)(state);
        let vote = voteFilter(id)( state );
        return rfv.isReadyForVote && rfv.hasSubscribed && ( ( vote &&  vote.fail ) || isRoot )
    }
}
export default canDisplayAmendFilter;
