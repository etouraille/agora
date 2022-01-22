import voteComplete from "../../utils/voteComplete";

const readyForVoteSubscribedFilter = ( id ) => {

    return ( state ) => {
        let user = state.login.user;
        let isOwner = false;
        let isReadyForVote = false;
        let hasSubscribed = false;

        if( user ) {
            let elem = state.readyForVote.find(elem => elem.id === id);
            if (user && elem && elem.data.find(elem => elem.user === user)) {
                isOwner = true;
            }
            if (elem) {
                let _for = elem.data.reduce((a, r) => r.readyForVote === true ? a + 1 : a, 0);
                let _against = elem.data.reduce((a, r) => r.readyForVote === false ? a + 1 : a, 0);
                let _max = elem.data.map(elem => elem.round).max();
                let _min = elem.data.map(elem => elem.round).min();
                isReadyForVote = (_min === _max) && voteComplete(_for , _against, elem.data.length, 'consensus');
            }
            hasSubscribed = -1 !== state.subscribed.subscribed.indexOf(id);
        }
        let ret = {isOwner, isReadyForVote, hasSubscribed};
        return ret;
    }
}
export default readyForVoteSubscribedFilter;
