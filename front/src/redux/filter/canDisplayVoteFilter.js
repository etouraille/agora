import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import subscribeIsBeforeFilter from "./subscribeIsBeforeFilter";
import documentFilter from "./documentFilter";

const canDisplayVoteFilter = ( id ) => {
    return ( state ) => {
        let rfv = readyForVoteSubscribedFilter(id)(state);
        const sib = subscribeIsBeforeFilter(id)(state);
        const doc = documentFilter(id)(state);
        const isRoot = doc.parentLink === null;
        return !isRoot && rfv.isReadyForVote && rfv.hasSubscribed && sib;
    }
}
export default canDisplayVoteFilter;
