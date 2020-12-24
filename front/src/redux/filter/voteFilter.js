const voteFilter = (id) => {
    return (state ) => {
        //console.log( id );
        let ret = {
            forIt : null,
            againstIt : null,
            abstention : null,
            majority : null,
            participants : null,
            fail : null,
            success : null,
            complete : null,
            final : null,
        }
        let elem = state.vote.find(elem => elem.id === id);
        if (elem) {
            let final = elem.votes.find( elem => elem.final )?elem.votes.find( elem => elem.final ).final: null;
            if( final ) {
                ret =  { ...final, final : true , complete : true };
                return ret;
            }
            let forIt = elem.votes.reduce((a, current) => (current.against === false ? a + 1 : a), 0);
            let againstIt = elem.votes.reduce((a, current) => (current.against === true  ? a + 1 : a), 0);
            let abstention = elem.votes.reduce((a, current) => (current.against === null ? a + 1 : a), 0);
            let participants = elem.votes.length;
            let majority = forIt >= ((participants / 2));
            let fail = againstIt > (participants / 2 ) ;
            let complete = majority || fail;
            ret =  {
                forIt: forIt,
                againstIt: againstIt,
                abstention: abstention,
                participants: participants,
                success: majority,
                fail : fail,
                complete : complete,
                final : false,
            }
            //console.log( ret );
        }
        //console.log( ret );
        return ret;
    }
}
export default voteFilter;