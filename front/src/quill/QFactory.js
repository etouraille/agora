import Quill from 'quill';
import $ from 'jquery';

class QFactory {
    static get(id , params ) {
        let  quill = Quill.find(document.querySelector(id));
        if( ! quill ) {
            quill = new Quill(id, params );
        }
        return quill;
    }
}
export default QFactory;