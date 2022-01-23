import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";
import subscribeIsBeforeFilter from "./subscribeIsBeforeFilter";

const canVoteFilter = (id) => {
    return (state) => {
        const canEdit = readyForVoteSubscribedFilter(id)(state);

        const subscribeIsBefore = subscribeIsBeforeFilter(id)(state);

        const vote = voteFilter(id)(state);

        return canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote && !vote.fail && subscribeIsBefore;
    }
}
export default canVoteFilter;
