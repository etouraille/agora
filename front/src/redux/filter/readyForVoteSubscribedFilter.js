const readyForVoteSubscribedFilter = ( id ) => {
    return ( state ) => {
        let user = state.login.user;
        let isOwner = false;
        let isReadyForVote = false;
        let hasSubscribed = false;

        if( user ) {
            let elem = state.readyForVote.find(elem => elem.id === id);
            //console.log( elem );
            if (user && elem && elem.data.find(elem => elem.user === user)) {
                isOwner = true;
            }
            if (elem) {
                isReadyForVote = elem.data.length === elem.data.reduce((a, r) => r.readyForVote === true ? a + 1 : a, 0);
            }
            hasSubscribed = -1 !== state.subscribed.subscribed.indexOf(id);
        }
        let ret = {isOwner, isReadyForVote, hasSubscribed};
        return ret;
    }
}
export default readyForVoteSubscribedFilter;