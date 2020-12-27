import React , { useEffect , useState, useCallback} from 'react';
import { useParams } from "react-router";
import http from "../http/http";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/slice/readyForVoteSlice";
import inviteSvg from './../svg/invite.svg';
import minusSvg from './../svg/minus.svg';
const Invite = ({id}) => {

    const [invitedUsers , setInvitedUsers ] = useState([]);
    const [users, setUsers] = useState([]);
    const [ reload , setReload ] = useState( false );
    const [creator, setCreator ] = useState ( false );

    const dispatch = useDispatch();

    const user = useSelector(state => state.login.user );

    useEffect(() => {
        let mounted = true;
        if( reload && user ) {
            http.get('/api/invited/' + id).then(data => {
                if( mounted ) {
                    let isCreator = data.data.find(elem => elem.meIsCreator);
                    if (isCreator) setCreator(true);
                    setInvitedUsers(data.data.filter(elem => elem.login !== user).map((user) => user.login));
                    setReload(false);
                }
            }, error => {
                console.log(error);
                setReload( false );
            })
        }
        return () => { mounted = false }
    }, [ reload , user ]);

    useEffect ( () => {
        //console.log('new users ', invitedUsers );
        let newUsers = users.filter( user => !invitedUsers.includes( user ));
        //console.log( newUsers );
        setUsers(newUsers);
    }, [ invitedUsers ]);


    useEffect(() => {
        let mounted = true;
        http.get('/api/users').then( (data) => {
            if( mounted ) {
                setUsers(data.data.map((user) => user.login).filter(elem => elem !== user));
                setReload(true);
            }
        }, error => {
            console.log( error);
        })

        return () => { mounted = false }


    }, [id])


    const invite = useCallback((email) => {
        http.post('/api/invite', {
            id : id,
            email : email
        }).then( (data) =>{
            dispatch(addUser({ id  : id , user : email , invitedBy : user }));
            setReload(true);
        }, error => { console.log( error )})
    }, [user ])

    const uninvite = useCallback((email) => {
        http.post('/api/uninvite', {
            id : id,
            email : email
        }).then( (data) =>{
            dispatch(removeUser({id : id , user : email }));
            setReload(true);
            users.push(email );
        }, error => { console.log( error )})
    })


    return (

        <div>
            <h1>Membres invités</h1>
            <ul className="list-group">
                {invitedUsers.map((user, index ) => {
                    return (<li className="list-group-item" key={index}>{user}
                        { creator ? <button className="btn btn-black float-right" onClick={() => uninvite(user)}><img className="logo-small margin-right" src={minusSvg} />Retirer</button> : <></> }
                    </li>)
                })}
            </ul>
            <br/>
            <h1>Membres à inviter</h1>
            <ul className="list-group">
                {users.map((user, index ) => {
                    return (
                        <li className="list-group-item" key={index}>{user}
                            <button className="btn btn-black float-right" onClick={() => invite(user)}><img className="logo-small margin-right" src={inviteSvg} /> Inviter</button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Invite;