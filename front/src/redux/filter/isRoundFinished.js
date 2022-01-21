import voteComplete from "../../utils/voteComplete";

const isRoundFinished = (id) => {
    return (state) => {
        let ret = false;
        let elem = state.readyForVote.find( elem => elem.id === id);
        if( elem ) {
            let _for = elem.data.reduce((a,b) => (b.readyForVote === true ? a + 1: a ), 0);
            let _against = elem.data.reduce((a,b) => (b.readyForVote === false ? a + 1: a ), 0);
            ret = voteComplete(_for, _against, elem.data.length, 'consensus');
        }
        return ret;
    }
}
export default isRoundFinished;
