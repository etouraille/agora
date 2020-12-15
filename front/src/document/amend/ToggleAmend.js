import React from 'react';

const ToggleAmend = ({showAmend, toggle}) => {
    return (
        <>
            { showAmend ? <button className="btn btn-primary btn-sm" onClick={toggle}>Masquer Amend</button> : <button className="btn btn-primary btn-sm" onClick={toggle}>Montrer Amend</button> }
        </>
    )
}
export default ToggleAmend;