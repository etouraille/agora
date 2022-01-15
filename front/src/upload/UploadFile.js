import React, {useCallback, useEffect, useRef, useState} from 'react';
import http from "../http/http";

const UploadFile = ({onUpload}) => {

    const [ selectedFile , setSelectedFile] = useState(null);
    const [ref , setRef ] = useState( null);

    const textInput = useRef(null);

    useEffect(() => {
        const cb = (evt) => {
            evt.stopPropagation();
        }
        if(textInput) {
            textInput.current.addEventListener("click", cb);
        }
        return () => {
            textInput.current.removeEventListener('click', cb );
        }
    }, [textInput]);

    const onFileChange = event => {
        // Update the state
        const file = event.target.files[0];
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "file",
            file,
            file.name
        );

        http.post(process.env.REACT_APP_cdn+ '/upload', formData).then((data) => {
            const file = data.data.file;
            if( typeof onUpload === 'function') {
                onUpload({link: file, type: 'file'});
            }
        })
    };

    const uploadFile = (evt) => {
        console.log(textInput.current);
        textInput.current.click();
        //evt.stopPropagation();

    }

    return (
        <div>
            <input id="file" ref={textInput} style={{display:'none'}} type="file" onChange={onFileChange} />
            <button className="btn" onClick={uploadFile}>
                Upload!
            </button>
        </div>
    )
}
export default UploadFile;
