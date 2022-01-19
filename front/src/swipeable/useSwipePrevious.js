import {useSwipeable} from "react-swipeable";
import history from "../utils/history";

const useSwipePrevious = () => {

    const { ref } = useSwipeable({
        onSwipedRight : (evt) => {
           history.goBack();

        }
    });

    return { ref };
}

export default useSwipePrevious;
