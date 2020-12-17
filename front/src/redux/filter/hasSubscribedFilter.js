import readyForVoteSubscribedFilter from "./readyForVoteSubscribedFilter";
const hasSubscribedFilter = ( id ) => {
    return ( state ) => {
        let readyForVote = readyForVoteSubscribedFilter(id)(state);
        if(readyForVote) {
            return readyForVote.hasSubscribed;
        } else {
            return null;
        }
    }
}
export default hasSubscribedFilter;