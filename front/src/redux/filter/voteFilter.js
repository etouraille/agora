const voteFilter = (id) => {
    return (state ) => {
        let elem = state.vote.find(elem => elem.id === id);
        if (elem) {
            let forIt = elem.votes.reduce((a, current) => current.against === false ? a + 1 : a, 0);
            let againstIt = elem.votes.reduce((a, current) => (current.against === true  ? a + 1 : a), 0);
            let abstention = elem.votes.reduce((a, current) => (current.against === null ? a + 1 : a), 0);
            let participants = elem.votes.length;
            let majority = forIt >= ((participants / 2))
            let fail = againstIt > (participants / 2 );
            let ret =  {
                forIt: forIt,
                againstIt: againstIt,
                abstention: abstention,
                total: participants,
                majority: majority,
                fail : fail,
            }
            //console.log( ret );
            return ret;
        }
        return null;
    }
}
export default voteFilter;