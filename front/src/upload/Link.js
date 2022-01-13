import React, {useCallback, useEffect, useState} from 'react';

const Link = ({onUpload}) => {

    const [ value , setValue ] = useState( '');

    const submit = (evt) => {
        evt.stopPropagation();console.log(1);
        if(value && value.match(/^https?/)) {
            onUpload({type: 'link', link: value});
            setValue('');
        }
    }

    return (
        <div>
            <input type="text" value={value} onChange={evt => setValue(evt.target.value)}/>
            <button className="btn btn-primary" onClick={submit}>Ajouter un lien</button>
        </div>
    )
}
export default Link;
