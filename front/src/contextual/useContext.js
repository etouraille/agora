import React , { useState , useCallback, useEffect } from 'react'
const useContext = () => {
    const [x , setX] = useState('0px');
    const [y, setY ] = useState('0px');
    const [show , setShow ] = useState(false );

    const handleContextMenu = useCallback((e) => {
      e.preventDefault();
      setX(`${e.pageX}px`);
      setY(`${e.pageY}px`);
      setShow(true);
    }, [setX, setY]);

    const handleClick = useCallback((e) => {
        show && setShow( false );
    }, [show]);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleContextMenu);
        }
    })

    return {x, y, show };
}

export default useContext;