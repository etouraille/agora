const voteComplete = (_for, _against, _voters, type) => {
    if (type === 'majority') {
        return _for >= (Math.floor(_voters / 2) + 1 )
    } else if( type === 'consensus') {
        return _for === _voters;
    } else {
        throw new Error(`${type} is not implented`);
    }
}
export default voteComplete;
