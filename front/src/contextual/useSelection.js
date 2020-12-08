import { useState, useCallback, useEffect } from 'react';
import rangy  from 'rangy';


const useSelection = (quill) => {

    console.log( quill );

    const [ selection , setSelection ] = useState([]);

    const mouseup = useCallback((evt ) => {
        if( quill ) {
            console.log( quill );
            const range = quill.getSelection(false);
            console.log ( range );
            if( range ) {
                console.log(range);
                setSelection(quill.getContents(range.index, range.length));
            }
        }
     }, [quill ]);

    useEffect(() => {
        window.addEventListener('mouseup', mouseup );
        return () => { window.removeEventListener('mouseup', mouseup)};
    },[])

    return { selection };
}
export default useSelection;