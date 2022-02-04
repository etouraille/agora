import voteComplete from "../../utils/voteComplete";
import documentFilter from "./documentFilter";
import subscribeIsBeforeFilter from "./subscribeIsBeforeFilter";

const readyForVoteSubscribedFilter = ( id ) => {

    return ( state ) => {

        let doc = documentFilter(id)(state);
        let userId = state.login.userId;
        let isOwner = false;
        let isReadyForVote = false;
        let hasSubscribed = false;
        let subscribeIsBefore = subscribeIsBeforeFilter(id)(state);


        if( userId ) {
            let elem = state.readyForVote.find(elem => elem.id === id);
            if (userId && elem && elem.data.find(elem => elem.user === userId)) {
                isOwner = true;
            }
            if (elem) {
                let _for = elem.data.reduce((a, r) => r.readyForVote === true ? a + 1 : a, 0);
                let _against = elem.data.reduce((a, r) => r.readyForVote === false ? a + 1 : a, 0);
                let _max = elem.data.map(elem => elem.round).max();
                let _min = elem.data.map(elem => elem.round).min();
                //TODO : the last condition shouldn't be present. In here because of migration.
                isReadyForVote = ((_min === _max) && voteComplete(_for , _against, elem.data.length, 'consensus'));
            }
            hasSubscribed = -1 !== state.subscribed.subscribed.indexOf(id);
        }
        let ret = {isOwner, isReadyForVote, hasSubscribed, subscribeIsBefore};
        return ret;
    }
}
export default readyForVoteSubscribedFilter;
