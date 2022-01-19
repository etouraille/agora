import {useEffect, useState} from "react";
import http from "../http/http";
import history from "./history";
import {init as initDoc} from "../redux/slice/documentSlice";
import {init} from "../redux/slice/amendSlice";
import {add, init as initMenu, initWith, off} from "../redux/slice/editMenuSlice";
import { initToggleDiff } from "../redux/slice/toggleDiffSlice";
import { initReload , reload as setReload } from "../redux/slice/reloadDocumentSlice";
import { initReloadVote  } from "../redux/slice/reloadVoteSlice";
import { init as initReadyForVote } from "../redux/slice/readyForVoteSlice";
import { init as initVote } from "../redux/slice/voteSlice";
import { useDispatch, useSelector } from "react-redux";
import documentFilter from "../redux/filter/documentFilter";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";

const useLoadDocument = ({ id , reload }) => {

    const dispatch = useDispatch();

    const [count, setCount ] = useState(0);
    const [leftMenus, setLeftMenus ] = useState([]);

    const document = useSelector( state => {
        let res =  state.document.find( elem => elem.id === id );
        if( res ) {
            return res.doc;
        } else {
            return { document : { title : null, body : null }, children : []};
        }
    })

    const sortedChildren = useSelector( state => {
        const doc = documentFilter(id)(state);
        let res = [];
        if( doc && doc.children ) {
            const data = [...doc.children];

            let ret = data.sort((elem, elem2) => {
                return ((elem.link.index < elem2.link.index) ? -1 : 1);
            })
            res = ret.map(elem => {
                let vote = readyForVoteSubscribedFilter(elem.child.id)(state);
                return {...elem, vote: vote};
            })
        }
        return res;
    })

    const setMenuFunc = (doc) => {
        let leftMenusTemp = [];
        if( doc.children.length > 0 ) {
            sortedChildren.forEach((elem, index ) => {
                leftMenusTemp.push({id: elem.child.id});

            })
        }
        setLeftMenus(leftMenusTemp);
    }

    useEffect(() => {
        setMenuFunc(document );
    }, [sortedChildren.length])

    useEffect(() => {
        leftMenus.forEach( (elem , index )=> {
            dispatch(add({ id : elem.id}));
        })
        //TODO
        if( leftMenus.length === 0 ) {
            dispatch( off());
            dispatch(initMenu());
        }
        return () => { dispatch( initMenu())}
    }, [leftMenus.length ])


    useEffect(() => {
        console.log(1, id );
        if (id) {
            http.get('/api/ready-for-vote/' + id).then(data => {
                console.log(data );
                dispatch(initReadyForVote({id: id, data: data.data}));
            }, error => {
                console.log(error);
            })
            http.get('/api/vote/voters/' + id ).then( data  => {
                dispatch( initVote({ id , data : data.data }))
            }, error => {
                console.log( error);
            })
        }

    }, [id])

    const partialForChange = [];

    useEffect(() => {
        console.log( 2)
;        leftMenus.forEach((menu) => {
            if( partialForChange.indexOf( menu.id ) === -1 ) {
                partialForChange.push( menu.id );
            }
            http.get( '/api/ready-for-vote/' + menu.id ).then( data => {
                dispatch(initReadyForVote({id : menu.id, data : data.data}));
            }, error => {
                console.log( error );
            })
            http.get('/api/vote/voters/' + menu.id ).then( data  => {
                dispatch( initVote({ id : menu.id , data : data.data }))
            }, error => {
                console.log( error);
            })
        });


        return () => {

        }
    }, [ leftMenus.length ])

    useEffect(() => {
        console.log(3);
        if( id ) {
            http.get('/api/document/' + id ).then(
                data => {
                    if( data.data.parent && data.data.parent.link && data.data.parent.link.voteComplete ) {
                        history.push( '/document/' + data.data.parent.document.id );
                        return;
                    }
                    /*
                    if( data.data.children === undefined ) {
                        history.push('/403');
                        return;
                    }
                     */
                    dispatch( initDoc({id : id, data : data.data }));
                    setCount( count + 1 );
                    let children = [];

                    const res  = [ ...data.data.children ];
                    let ret = res.sort((elem , elem2) => {
                        return ((elem.link.index  < elem2.link.index) ? -1 : 1);
                    })

                    ret.map(( object , index ) =>{
                        children.push( object.child.id );
                    })
                    dispatch(init({id : id , data : children }));
                    dispatch(initWith({data: children }));
                    dispatch(initToggleDiff({id : id  }));
                    dispatch(initReload({id : id }))
                    dispatch(initReloadVote({id : id }));
                },error => {
                    console.log( error )
                })
        }

    }, [ reload , id ]);

    return { document , count , doc : document , leftMenus };

}

export default useLoadDocument;
