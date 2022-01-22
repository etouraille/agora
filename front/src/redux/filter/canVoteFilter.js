import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import voteFilter from "./voteFilter";

const canVoteFilter = (id) => {
    return (state) => {
        const canEdit = readyForVoteSubscribedFilter(id)(state);

        const vote = voteFilter(id)(state);

        return canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote && !vote.fail && canEdit.subscribedIsBefore;
    }
}
export default canVoteFilter;
