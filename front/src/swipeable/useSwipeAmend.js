import {useSwipeable} from "react-swipeable";
import {useDispatch} from "react-redux";
import {toggleAmend} from "../redux/slice/toggleAmend";
import history from "../utils/history";

const useSwipeAmend = ({editor, id }) => {

    const dispatch = useDispatch();

    const { ref } = useSwipeable({
        onSwipedLeft : (evt) => {
            evt.event.stopPropagation();
            evt.event.preventDefault();
            if( editor && editor.getSelection() && editor.getSelection().length > 0 ) {
                dispatch(toggleAmend({from: 'context-menu'}));
            } else if (editor) {
                history.push('/documentamend/' + id);
            }
        }
    }, { preventDefaultTouchmoveEvent: true });

    return { ref };
}

export default useSwipeAmend;
