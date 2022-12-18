import React , { useEffect , useState, useCallback} from 'react';
import { useParams } from "react-router";
import http from "../http/http";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/slice/readyForVoteSlice";
import inviteSvg from './../svg/invite.svg';
import minusSvg from './../svg/minus.svg';
import SearchApi from "../search/SearchApi";
const Invite = ({id}) => {

    const [invitedUsers , setInvitedUsers ] = useState([]);
    const [users, setUsers] = useState([]);
    const [ reload , setReload ] = useState( false );
    const [creator, setCreator ] = useState ( false );

    const dispatch = useDispatch();

    const user = useSelector(state => state.login.userId );

    useEffect(() => {
        let mounted = true;
        if( reload && user ) {
        }
        http.get('/api/invited/' + id).then(data => {
            if( mounted ) {
                let isCreator = data.data.find(elem => elem.meIsCreator);
                console.log( isCreator);
                if (isCreator) setCreator(true);
                setInvitedUsers(data.data.filter(elem => elem.id !== user));
                setReload(false);
            }
        }, error => {
            console.log(error);
            setReload( false );
        })
        return () => { mounted = false }
    }, [ reload , user ]);

    useEffect ( () => {
        //console.log('new users ', invitedUsers );
        let newUsers = users.filter( user => !invitedUsers.map(elem => elem.id).includes( user ));
        //console.log( newUsers );
        setUsers(newUsers);
    }, [ invitedUsers ]);


    useEffect(() => {
        let mounted = true;
        http.get('/api/users').then( (data) => {
            if( mounted ) {
                setUsers(data.data.filter(elem => elem.id !== user));
                setReload(true);
            }
        }, error => {
            console.log( error);
        })

        return () => { mounted = false }


    }, [id])


    const invite = useCallback((userId) => {
        http.post('/api/invite', {
            id,
            userId,
        }).then( (data) =>{
            dispatch(addUser({ id  : id , user : userId , invitedBy : user, round: data.data.round }));
            setReload(true);
        }, error => { console.log( error )})
    }, [user ])

    const uninvite = useCallback((user) => {
        http.post('/api/uninvite', {
            id : id,
            userId: user.id
        }).then( (data) =>{
            dispatch(removeUser({id : id , user : user.id }));
            setReload(true);
            users.push(user);
        }, error => { console.log( error )})
    })


    return (

        <div>
            <h1>Membres invités</h1>
            <ul className="list-group">
                {invitedUsers.map((user, index ) => {
                    return (<li className="list-group-item" key={index}>{user.name}
                        { creator ? <button className="btn btn-black float-right" onClick={() => uninvite(user)}><img className="logo-small margin-right" src={minusSvg} />Retirer</button> : <></> }
                    </li>)
                })}
            </ul>
            <br/>
            <h1>Membres à inviter</h1>
            <SearchApi api={`/api/search-user`} item={((elem, index) => <>{ elem.id !== user && invitedUsers.findIndex(rs => rs === elem.id ) === -1 ?  <li className="list-group-item" key={index}>{elem.name}
                <button className="btn btn-black float-right" onClick={() => invite(elem.id)}><img className="logo-small margin-right" src={inviteSvg} />Inviter</button>
            </li>: <></> }</>)}></SearchApi>
        </div>
    )
}

export default Invite;
