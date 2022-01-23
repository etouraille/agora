const subscribeIsBeforeFilter = (id) => {
    return (state) => {
        let ret = false;
        let elem = state.subscribeIsBefore.find(elem => elem.id === id);
        if( elem ) {
            ret = elem.subscribeIsBefore;
        }
        return ret;
    }
}
export default subscribeIsBeforeFilter;
