const voteFilter = (id) => {
    return (state ) => {
        //console.log( id );
        let elem = state.vote.find(elem => elem.id === id);

        if (elem) {
            let final = elem.votes.find( elem => elem.final )?elem.votes.find( elem => elem.final ).final: null;
            if( final ) {
                return { ...final, final : true };
            }
            let forIt = elem.votes.reduce((a, current) => (current.against === false ? a + 1 : a), 0);
            let againstIt = elem.votes.reduce((a, current) => (current.against === true  ? a + 1 : a), 0);
            let abstention = elem.votes.reduce((a, current) => (current.against === null ? a + 1 : a), 0);
            let participants = elem.votes.length;
            let majority = forIt >= ((participants / 2));
            let fail = againstIt > (participants / 2 ) ;
            let complete = majority || fail;
            let ret =  {
                forIt: forIt,
                againstIt: againstIt,
                abstention: abstention,
                participants: participants,
                majority: majority,
                fail : fail,
                complete : complete,
                final : false,
            }
            //console.log( ret );
            return ret;
        }
        return null;
    }
}
export default voteFilter;