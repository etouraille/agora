import voteComplete from "./voteComplete";

const voteFailure = (_for, _against, _voters, type) => {
    if(type === 'majority') {
        return !voteComplete(_for, _against, _voters, type) &&  _against > (_voters / 2)
    } else if( type === 'consensus') {
        return !voteComplete(_for, _against, _voters, type) &&  _against > 0
    } else {
        throw new Error(`${type} is not implented`);
    }
}
export default voteFailure;
