import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import UploadFile from "../../upload/UploadFile";
import Link from "../../upload/Link";
import http from "../../http/http";


const Attachement = ({id}) => {

    const [objects, setObjects] = useState([]);
    const [files, setFiles] = useState([]);
    const [current, setCurrent ] = useState(0);
    const [ url, setUrl] = useState(null);
    const [ type, setType] = useState(null);
    const [ref, setRef ] = useState(null);
    const [text, setText] = useState('');
    const [radio, setRadio] = useState(null);
    const user = useSelector((state) => {
        return state.login.user;
    })

    const onUpload = (event) => {
        attach({ ...event, text });
        setText('');
    }

    const onSave = (evt) => {
        evt.stopPropagation();
        setText('');
        attach({text, type: 'nothing', link: ''});
    }

    const a_ref = useRef(null);

    useEffect(() => {
        const cb = (evt) => {
            evt.stopPropagation();
            window.open( evt.target.href, '_blank');
        }
        if(ref) {
            console.log('add event listener ========');
            ref.addEventListener('click', cb);
        }
        return () => {
            if(ref) ref.removeEventListener('click', cb);
        }
    }, [ref]);



    // only if user is owner.
    const remove = (i, evt ) => {
        evt.stopPropagation();
        let object = objects[i];
        objects.splice(i, 1);
        setFiles(objects);
        if( object.type === 'file') {
            http.delete(process.env.REACT_APP_cdn + '/picture/' + object.link);
        }
        http.delete('/api/attach/' + object.uid);
    }

    const attach = (data) => {
        http.post('/api/attach', {id, data}).then((data) => {
            objects.push(data.data);
            setObjects(objects);
            selectDisplay(objects.length-1);
        });
    }

    useEffect(() => {
        http.get('/api/attach/' + id ).then((data) => {
            setObjects(data.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const selectDisplay = (index) => {
        setCurrent(index);
        let object = objects[index];
        if(object.type === 'file') {
            if(object.link.match(/(\.png|\.jpg|\.jpeg|\.gif)$/)) {
                setType('pic');
            } else {
                setType('doc');
            }
            setUrl(process.env.REACT_APP_cdn + '/file/' + object.link);
        } else {

            setType('url');
            setUrl(object.link);
        }
    }

    const selectLink = (i, evt) => {
        evt.stopPropagation();
        selectDisplay(i);
    }

    const renderDisplay = useCallback(() => {
        if( type && url) {
            switch(type) {
                case 'pic':
                    return (
                        <img className="picture-content" src={url} />
                    )
                    break;
                case 'doc':
                    let _url = "https://docs.google.com/gview?url=" + url + "&embedded=true";
                    return (
                        <iframe className="iframe-content" src={_url}></iframe>
                    )
                    break;
                case 'url':
                    return (
                        <a href={url} ref={_ref => setRef(_ref)} target="_blank">{url}</a>
                    )
                    break;
            }
        } else {
            return <></>
        }
    }, [type, url, a_ref])

    //can attach : files, link, video. whatever.

    const nothing = (evt) => {
        evt.stopPropagation();
        setRadio('nothing');
    }

    const file = (evt) => {
        evt.stopPropagation();
        setRadio('file');
    }

    const link = (evt) => {
        evt.stopPropagation();
        setRadio('link');
    }

    const changeRadio = (evt) => {
        evt.stopPropagation();
        setRadio(evt.target.value)
    }

    const stop = (evt) => {
        evt.stopPropagation();
    }

    return (
        <>
            <div>
                <div>
                    <textarea onChange={evt => setText(evt.target.value)} placeholder="Ajouter un commentaire pour aider au vote" style={{width:'100%'}} value={text}></textarea>
                </div>
                {text ? <div>
                    <div className="box-space-around">
                        <div>
                            <label>Ne rien attacher au commentaire</label><input onClick={stop} onChange={changeRadio} checked={radio==='nothing'}  value="nothing" type="radio" />
                        </div>
                        <div>
                            <label>Attacher un fichier</label><input onClick={stop} onChange={changeRadio} checked={radio==='file'}  value="file" type="radio" />
                        </div>
                        <div>
                            <label>Attacher un lien</label><input onClick={stop} onChange={changeRadio} checked={radio==='link'} value="link" type="radio" />
                        </div>
                    </div>
                    <div className="box-space-around">
                        { radio === 'link' ? <Link onUpload={onUpload}></Link> : <></> }
                        { radio === 'file' ? <UploadFile onUpload={onUpload}></UploadFile> : <></> }
                        { radio === 'nothing' ? <button className="btn btn-primary" onClick={onSave}>Save</button>: <></> }
                    </div>
                </div> : <></> }
            </div>
            <div>
                { objects.map((elem, i) => {
                    return (
                        <div key={i}>{elem.text}<a onClick={evt => selectLink(i, evt )}>{elem.link}</a>{ user === elem.by ? <i className="fa fa-times" onClick={(evt) => remove(i, evt)}></i> : <></> }</div>
                    )
                }
            )}</div>
            <div className="doc-content">{renderDisplay()}</div>
        </>
    )
}
export default Attachement;
