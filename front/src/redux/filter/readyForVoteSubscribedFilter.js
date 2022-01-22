import voteComplete from "../../utils/voteComplete";
import documentFilter from "./documentFilter";

const readyForVoteSubscribedFilter = ( id ) => {

    return ( state ) => {

        let doc = documentFilter(id)(state);
        console.log(doc);

        let user = state.login.user;
        let isOwner = false;
        let isReadyForVote = false;
        let hasSubscribed = false;
        let subscribedIsBefore = false;

        if( user ) {
            let elem = state.readyForVote.find(elem => elem.id === id);
            if (user && elem && elem.data.find(elem => elem.user === user)) {
                isOwner = true;
            }
            if (user && elem ) {
                subscribedIsBefore = elem.data.find(elem => elem.user === user)?.subscribedIsBefore;
            }
            // TODO it should be out of the array, this is a bug. Because user could be among the one that has not modified it.
            if (elem) {
                let _for = elem.data.reduce((a, r) => r.readyForVote === true ? a + 1 : a, 0);
                let _against = elem.data.reduce((a, r) => r.readyForVote === false ? a + 1 : a, 0);
                let _max = elem.data.map(elem => elem.round).max();
                let _min = elem.data.map(elem => elem.round).min();
                console.log( _min, _max, _for, _against, elem.data.length );
                isReadyForVote = ((_min === _max) && voteComplete(_for , _against, elem.data.length, 'consensus')) || doc.parentLink === null;
            }
            hasSubscribed = -1 !== state.subscribed.subscribed.indexOf(id);
        }
        let ret = {isOwner, isReadyForVote, hasSubscribed, subscribedIsBefore};
        return ret;
    }
}
export default readyForVoteSubscribedFilter;
