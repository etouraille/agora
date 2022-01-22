import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";

const canDisplayVoteFilter = ( id ) => {
    return ( state ) => {
        let rfv = readyForVoteSubscribedFilter(id)(state);
        return rfv.isReadyForVote && rfv.hasSubscribed && rfv.subscribedIsBefore;
    }
}
export default canDisplayVoteFilter;
