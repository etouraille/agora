import {useCallback, useEffect, useState} from "react";
import http from "./http/http";
import Quill from "quill";
import Delta from 'quill-delta';
import history from "./utils/history";
import {Dropdown} from "react-bootstrap";
import useIsMobile from "./utils/useIsMobile";

const Home = () => {

    const [ docs, setDocuments] = useState([]);
    const [ page, setPage] = useState(1);

    const isMobile = useIsMobile();

    useEffect(() => {
        http.post('/home', {page}).then(data => {
            setDocuments( data.data);
        })
    }, [page])

    useEffect(() => {
        if(docs && docs.length > 0) {
            docs.forEach((doc, index) => {
                let editor  = new Quill('#content_' + index , {readOnly: true});

                editor.setContents(doc.content);
                let length = editor.getLength();
                let content = editor.getContents();

                let delta = [];
                let displayLength = 140;
                delta.push({retain: displayLength})
                delta.push({delete: length - displayLength});
                editor.setContents(content.compose(new Delta(delta)));
            })
        }
    }, [docs])

    const navigate = useCallback((id) => {
        history.push('/document/' + id);
    });

    const item = (elem, index ) => {
        return (
            <div key={index} className={`item-home${isMobile ? '-mobile': ''}`}>
                <h6 onClick={evt => navigate(elem.id)}>{elem.title}</h6>
                <div id={`content_${index}`}></div>
                { elem.users.length > 0 ? <div className="item-users">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {elem.users.map((user, index) => <Dropdown.Item key={index}>{user.name}</Dropdown.Item>)}
                        </Dropdown.Menu>
                    </Dropdown>
                </div> : <></> }
            </div>
        )
    }

    return (
        <>
            <div className="box-space-around">
                <div>
                    { page > 1 ? <button className="btn btn-black" onClick={(evt) => setPage(page-1)}>Précédent</button> : <></> }
                    <button className="btn btn-black" onClick={(evt) => setPage(page+1)}>Suivant</button>
                </div>
            </div>
            <div className="box-space-around">
                { docs.map((elem, index) => item( elem, index))}
            </div>


        </>
    )
}

export default Home;
