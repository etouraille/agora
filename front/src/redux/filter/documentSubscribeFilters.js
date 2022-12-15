const documentSubscribeFilters = (state ) => {



        let user = state.login.userId;
        let sub = state.documentSubscribe.documents;
        let ret = [];
        if( user ) {
            sub.forEach(elem => {
                let id = elem.id
                if (elem.users.indexOf(user) >= 0) {
                    ret.push(id);
                }
            })
            return ret;
        } else {
            return null;
        }
        //console.log( ret);


}
export default documentSubscribeFilters;