import { useParams } from "react-router";
import {useEffect, useState} from "react";
import http from "../http/http";
import history from "../utils/history";
import ItemDocument from "./ItemDocument";

const User = () => {

    const { id } = useParams();
    const [user, setUser ] = useState(null);

    useEffect(() => {
        http.get('/user/' + id).then(data => {
            setUser(data.data);
            console.log( data.data);
        }).catch(error => {
            history.push('/404');
        })
    }, [id])

    return (
        <>
            { user ? <div>
                <ul>
                    <li>{user.name}</li>
                    { user.picture ? <li><img src={user.picture} /></li> : <></> }
                    <li>A voté pour {user.vf } fois </li>
                    <li>A voté contre {user.va } fois </li>
                </ul>
                <h6>Subscried docs</h6>
                <div className="box-space-around">
                    { user.subscribedDocs.map((elem, index) => <ItemDocument document={elem} index={index}></ItemDocument>) }
                </div>
            </div> : <></>}
        </>
    )
}

export default User;
