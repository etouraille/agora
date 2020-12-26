const barreToggleFilter = (id) => {
    return ( state ) => {
        let elem  = state.barreToggle.barreToggle ? state.barreToggle.barreToggle.find( elem => elem.id === id ) : null;
        if( elem ) {
            return elem.display;
        } else {
            return false;
        }
    }
}
export default barreToggleFilter;