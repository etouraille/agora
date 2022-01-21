const voteComplete = (_for, _against, _voters, type) => {
    if(type === 'majority') {
        return _for >= (_voters / 2 + 1 )
    } else if( type === 'consensus') {
        return _for === _voters;
    } else {
        throw new Error(`${type} is not implented`);
    }
}

const voteFailure = (_for, _against, _voters, type) => {
    console.log(_for, _against, _voters );
    if(type === 'majority') {
        return !voteComplete(_for, _against, _voters, type) &&  _against > (_voters / 2)
    } else if( type === 'consensus') {
        return !voteComplete(_for, _against, _voters, type) &&  _against > 0
    } else {
        throw new Error(`${type} is not implented`);
    }
}


module.exports = {
    voteComplete,
    voteFailure,
}
