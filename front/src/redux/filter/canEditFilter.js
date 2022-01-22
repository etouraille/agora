import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";

const canEditFilter = (id) => {
    return (state) => {
        const canEdit = readyForVoteSubscribedFilter(id)(state);
        return canEdit && canEdit.isOwner && ! canEdit.isReadyForVote;
    }
}

export default canEditFilter;
