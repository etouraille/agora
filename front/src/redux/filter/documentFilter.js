const documentFilter = ( id , callback  ) => {
    return (state) => {
        let ret = { document : { title : null, body : null }, children : []};
        let res =  state.document.find( elem => elem.id === id );
        if( res ) {
            ret = res.doc;
        }
        if( callback && typeof callback === 'function') {
            callback( ret );
        }
        return ret;
    }
}
export default documentFilter;