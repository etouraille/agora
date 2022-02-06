import {useEffect, useState} from "react";
import http from "../http/http";

const Users = () => {

    const [users, setUsers ] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        http.get('/api/users').then(data => {
            setUsers(data.data);
        })
    }, [count]);

    const deleteUser = (id) => {
        http.delete('/api/user/' + id).then(() => {
            setCount(count + 1);
        })
    }

    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col">name</th>
                <th scope="col">email</th>
                <th scope="col">delete</th>
            </tr>
            </thead>
            <tbody>
            { users.map((elem, index) => {
                    return (
                      <tr>
                        <th scope="row">{elem.id}</th>
                        <td>{elem.name}</td>
                        <td>{elem.login}</td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={(evt) => deleteUser(elem.id)}>
                                Delete
                            </button>
                        </td>
                      </tr>
                    )
                })
            }

            </tbody>
        </table>
    )

}
export default Users;
