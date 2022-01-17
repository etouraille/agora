import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";

const canDisplayAmendFilter = ( id ) => {
    return ( state ) => {
        let rfv = readyForVoteSubscribedFilter(id)(state);
        let vote = voteFilter(id)( state );
        //console.log(vote);
        return rfv.isReadyForVote && rfv.hasSubscribed && vote && vote.fail
    }
}
export default canDisplayAmendFilter;
