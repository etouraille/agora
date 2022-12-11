import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import subscribeIsBeforeFilter from "./subscribeIsBeforeFilter";
import documentFilter from "./documentFilter";

const canVoteFilter = (id) => {
    return (state) => {
        const canEdit = readyForVoteSubscribedFilter(id)(state);

        const subscribeIsBefore = subscribeIsBeforeFilter(id)(state);

        const doc = documentFilter(id)(state);

        const isRoot = doc.parentLink === null;

        const vote = voteFilter(id)(state);

        return canEdit && !isRoot && canEdit.hasSubscribed && canEdit.isReadyForVote && !vote.fail && subscribeIsBefore;
    }
}
export default canVoteFilter;
