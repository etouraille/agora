import React , { useEffect , useState, useCallback} from 'react';
import { useParams } from "react-router";
import http from "../http/http";

const Invite = () => {

    const { id } = useParams();
    const [invitedUsers , setInvitedUsers ] = useState([]);
    const [users, setUsers] = useState([]);
    const [ reload , setReload ] = useState( false );

    useEffect(() => {
        if( reload ) {
            http.get('/api/invited/' + id).then(data => {
                setInvitedUsers(data.data.map((user) => user.login));
                setReload( false );
            }, error => {
                console.log(error);
                setReload( false );
            })
        }
    }, [ reload ]);

    useEffect ( () => {
        console.log('new users ', invitedUsers );
        let newUsers = users.filter( user => !invitedUsers.includes( user ));
        console.log( newUsers );
        setUsers(newUsers);
    }, [ invitedUsers ]);


    useEffect(() => {
        http.get('/api/users').then( (data) => {
            setUsers(data.data.map((user) => user.login ) );
            setReload (true);
        }, error => {
            console.log( error);
        })


    }, [id])


    const invite = useCallback((email) => {
        http.post('/api/invite', {
            id : id,
            email : email
        }).then( (data) =>{
            setReload(true);
        }, error => { console.log( error )})
    })


    return (

        <div>
            <h1>Membres invités</h1>
            <ul className="list-group">
                {invitedUsers.map((user, index ) => {
                    return <li className="list-group-item" key={index}>{user}</li>
                })}
            </ul>
            <br/>
            <h1>Membres à inviter</h1>
            <ul className="list-group">
                {users.map((user, index ) => {
                    return (
                        <li className="list-group-item" key={index}>{user}
                            <button className="btn btn-primary float-right" onClick={() => invite(user)}>Ajouter</button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Invite;