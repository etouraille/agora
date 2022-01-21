const voteComplete = (_for, _against, _voters, type) => {
    if (type === 'majority') {
        return _for >= (Math.floor(_voters / 2) + 1 )
    } else if( type === 'consensus') {
        console.log( _for, _voters, _for === _voters )
        return _for === _voters;
    } else {
        throw new Error(`${type} is not implented`);
    }
}
export default voteComplete;
