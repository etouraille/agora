
const isDocumentRootFilter = ( id ) => {
    return ( state ) => {
        let ret = state.document.find(elem => elem.id === id );

        return !!!ret?.doc?.parentLink;
    }
}
export default isDocumentRootFilter;
