import {useEffect, useState} from "react";
import http from "../http/http";

const Document = () => {

    const [documents, setDocuments] = useState([]);
    const [ n, setN] = useState(0)

    useEffect(() => {
        http.get('/admin/document').then(data => {
            setDocuments(data.data);
        })
    }, [n]);

    const deleteDocument = (id) => {
        http.delete('/admin/document/' + id).then(() => {
            setN(n+1);
        })
    }

    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">id</th>
                <th scope="col">title</th>
                <th scope="col">delete</th>
            </tr>
            </thead>
            <tbody>
            { documents.map((elem, index) => {
                return (
                    <tr>
                        <th scope="row">{elem.id}</th>
                        <td>{elem.title}</td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={(evt) => deleteDocument(elem.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            })
            }

            </tbody>
        </table>
    )

}
export default Document;
