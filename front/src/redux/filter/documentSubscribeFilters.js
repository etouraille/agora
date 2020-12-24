const documentSubscribeFilters = (state ) => {

        let user = state.login.user;
        let sub = state.documentSubscribe.documents;
        let ret = [];
        if( user ) {
            sub.forEach(elem => {
                let id = elem.id
                if (elem.users.indexOf(user) >= 0) {
                    ret.push(id);
                }
            })
        }
        //console.log( ret);
        return ret;

}
export default documentSubscribeFilters;