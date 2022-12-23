import http from "../http/http";
import {useState} from "react";

const Search = ({onChange}) => {

    const [ users, setUsers] = useState([]);
    const [ value, setValue ] = useState('');

    const change = (evt) => {
        let value = evt.target.value;
        setValue(value);
        onChange({value, isUser: false});
        if(value.length > 1) {
           http.post('api/search-user', {data: value}).then(data=> {
               setUsers(data.data)
           })
        } else {
            setUsers([]);
        }
    }

    const selectUser = (id, name ) => {
        setValue(name);
        onChange({ value: id, isUser : true});
        setUsers([]);
    }

    return(
        <div className="form-group">
            <input className="form-control" onChange={change} value={value}/>
            <ul className="suggest">
                {users.map(user => <li className="suggest-item" onClick={evt => selectUser(user.id, user.name)}><img className="icon" src={user.picture} />{user.name} ({user.email})</li>)}
            </ul>
        </div>
    )
}
export default Search;