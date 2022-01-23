import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import subscribeIsBeforeFilter from "./subscribeIsBeforeFilter";

const canDisplayVoteFilter = ( id ) => {
    return ( state ) => {
        let rfv = readyForVoteSubscribedFilter(id)(state);
        const sib = subscribeIsBeforeFilter(id)(state);
        return rfv.isReadyForVote && rfv.hasSubscribed && sib;
    }
}
export default canDisplayVoteFilter;
