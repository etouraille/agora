import React , { useState, useEffect, useCallback  } from 'react';
import $ from 'jquery';
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggle  } from './../redux/slice/editMenuSlice';
import history from "../utils/history";
const EditMenu = ({ id , node , disp }) => {

    const dispatch = useDispatch();

    const [x, setX ] = useState(0);
    const [y, setY ] = useState(0);
    const [display, setDisplay] = useState( false );
    const [displayList, setDisplayList] = useState( false );

    useEffect(() => {
        setDisplay(disp);
    }, [disp])

    useEffect(() => {

        const mouseEnter = (evt ) => {
            console.log('mouseenter');
            dispatch(toggle( { id : id }));
            setDisplay(true);
        }
        if(node) {
            setX($(node).offset()['left']);
            setY($(node).offset()['top']);
        }

        $(node).on('mouseenter', mouseEnter);

        return () => {
            $(node).off('mouseenter', mouseEnter);
        }
    }, [id, node ]);

    const enterCaret = ( evt ) => {
        setDisplayList(true);
    }

    const outList = ( evt ) => {
        setDisplayList(false );
        setDisplay(false);
    }

    const edit = () => {
        history.push('/documentedit/' + id );
    }

    return (
        <div style={{
            position : 'absolute',
            left : x + 'px',
            top : y + 'px' ,
            display : display ? 'block' : 'none'
        }}>
            <div className="caret down" onMouseEnter={enterCaret} ></div>
            <div className="menu-container" onMouseOut={outList} style={{ display : displayList ? 'block' : 'none'}}>
                <nav className="nav flex-column">
                    <button className="nav-link active" onClick={edit}>Edit</button>
                </nav>
            </div>
        </div>
    )
}
export default EditMenu;