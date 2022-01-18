import { useEffect, useState} from "react";
import http from "./http/http";
import useIsMobile from "./utils/useIsMobile";
import ItemDocument from "./user/ItemDocument";

const Home = () => {

    const [ docs, setDocuments] = useState([]);
    const [ page, setPage] = useState(1);

    const isMobile = useIsMobile();

    useEffect(() => {
        http.post('/home', {page}).then(data => {
            setDocuments( data.data);
        })
    }, [page])

    return (
        <>
            <div className="box-space-around">
                <div>
                    { page > 1 ? <button className="btn btn-black" onClick={(evt) => setPage(page-1)}>Précédent</button> : <></> }
                    <button className="btn btn-black" onClick={(evt) => setPage(page+1)}>Suivant</button>
                </div>
            </div>
            <div className="box-space-around">
                { docs.map((elem, index) => <ItemDocument index={index} document={elem}></ItemDocument>)}
            </div>


        </>
    )
}

export default Home;
