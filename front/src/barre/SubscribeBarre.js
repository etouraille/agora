import React, {useState, useEffect} from 'react';
import subscribe from "../svg/subscribe.svg";
import {useParams} from "react-router";
import Subscribe from "../document/subscribe/Subscribe";
import http from "../http/http";
import {useDispatch} from "react-redux";
import {initForOneDocument} from '../redux/slice/documentSubscribeSlice';
import { reload } from "../redux/slice/reloadDocumentSlice";

const SubscribeBarre = () => {

    let canDisplay = true;

    const [ right , setRight ] = useState( '0px');
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [zIndex , setZIndex ] = useState( -1 );

    const { id } = useParams();

    const dispatch = useDispatch();


    const toggle = () => {
        if(right === '0px') {
            setRight('200px');
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        }
        else{
            setRight('0px');
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );

        }
    }


    useEffect(() => {
        http.get('/api/subscribed-doc/' + id ).then( data => {
            dispatch(initForOneDocument({id , data : data.data }));
        }, error => {
            console.log(error );
        })
    }, [id])

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <img onClick={toggle} className="logo " src={subscribe} alt="Amend"/>
                <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content">
                    <Subscribe id={id}></Subscribe>
                </div>
            </div> : <></> }
        </>
    )
}
export default SubscribeBarre;