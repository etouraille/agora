import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
import {useSelector} from "react-redux";
import voteFilter from "./voteFilter";

const canGoToDoc = (id) => {
    return (state) => {
        const vote =  voteFilter(id)(state);
        const canEdit = readyForVoteSubscribedFilter(id)(state);
        return canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote && vote.fail;

    }
}
export default canGoToDoc;
