import React from 'react';
import useContext from "./useContext";
const ContextMenu = ({ menu }) => {
    const {x , y, show } = useContext();

    return (<></>)

    return (
        <div>
            { show ? (
                <div className="menu-container" style={{ top : y, left : x ,position : 'absolute' }}>
                    {menu()}
                </div>
            ) : (<div></div>)}
        </div>
    )
}
export default ContextMenu;
