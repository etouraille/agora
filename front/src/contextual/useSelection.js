import { useState, useCallback, useEffect } from 'react';


const useSelection = (quill) => {

    console.log( quill );

    const [ selection , setSelection ] = useState([]);

    const mouseup = useCallback((evt ) => {
        if( quill ) {
            const range = quill.getSelection(false);
            if( range ) {
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