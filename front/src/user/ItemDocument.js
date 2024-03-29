import {Dropdown} from "react-bootstrap";
import Quill from "quill";
import Delta from "quill-delta";
import {useCallback, useEffect} from "react";
import history from "../utils/history";
import useIsMobile from "../utils/useIsMobile";
import {firstChar} from "../utils/truncateEditor";


const ItemDocument = ({ index, document }) => {

    const isMobile = useIsMobile();

    useEffect(() => {
        let editor  = new Quill('#content_' + index , {readOnly: true});

        editor.setContents(document.content);


        firstChar(editor, 140);

    }, [index, document]);

    const navigate = useCallback((id) => {
        history.push('/document/' + id);
    });

    const navigateUser = ( id) => {
        history.push('/user/' + id);
    }

    return (
        <div key={index} className={`item-home${isMobile ? '-mobile': ''}`}>
            <h6 onClick={evt => navigate(document.id)}>{document.title}</h6>
            <div id={`content_${index}`}></div>
            { document.users && document.users.length > 0 ? <div className="item-users">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {document.users.map((user, index) => <Dropdown.Item key={index} onClick={evt => navigateUser(user.id)}>{user.name}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
            </div> : <></> }
        </div>
    );
}

export default ItemDocument;
