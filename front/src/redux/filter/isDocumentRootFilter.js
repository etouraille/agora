
const isDocumentRootFilter = ( id ) => {
    return ( state ) => {
        let ret = state.document.find(elem => elem.id === id );

        console.log(ret);

        return ret?.doc?.parentLink === null;
    }
}
export default isDocumentRootFilter;
