import {useSwipeable} from "react-swipeable";
import history from "../utils/history";
import React, {useState} from "react";
import VoteModal from "../document/vote/VoteModal";
import {useSelector} from "react-redux";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import voteFilter from "../redux/filter/voteFilter";
import canVoteFilter from "../redux/filter/canVoteFilter";
import canEditFilter from "../redux/filter/canEditFilter";
import canGoToDoc from "../redux/filter/canGoToDoc";

const SwipeAmendItem = ({id, elem, index , reload}) => {

    const [toggleModal, setToggleModal] = useState(false);

    const canGoDoc = useSelector(canGoToDoc(id))

    const canVote = useSelector(canVoteFilter(id));

    const canEdit = useSelector(canEditFilter(id));

    const { ref } = useSwipeable({
        onSwipedLeft : (evt) => {
            if (canGoDoc) {
                history.push('/document/' + id );
            }
            if (canVote) {
                //TODO maybe do some view instead of clicking
                setToggleModal(!toggleModal);
            }
            if( canEdit ) {
                history.push('/documentedit/' + id );
            }
        }
    });

    useState(() => {
        ref(elem);
    })

    return (<VoteModal key={index} id={id} toggleModal={toggleModal} onChangeToggle={setToggleModal} reload={reload}></VoteModal>)
}
export default SwipeAmendItem;
