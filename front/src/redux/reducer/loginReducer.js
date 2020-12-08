const loginReducer = (state, action ) => {
    if( action.type == 'LOGIN') {
        return {...state, logged : true , token : action.payload.token };
    }
    if(action.type == 'LOGOUT') {
        return { ... state , logged : false, token : null};
    }
    return state;
}

export default loginReducer;