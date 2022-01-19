import {useSwipeable} from "react-swipeable";
import history from "../utils/history";
import React, {useState} from "react";
import VoteModal from "../document/vote/VoteModal";
import {useSelector} from "react-redux";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import voteFilter from "../redux/filter/voteFilter";

const SwipeAmendItem = ({id, elem, index , reload}) => {

    const [toggleModal, setToggleModel] = useState(false);

    const canEdit = useSelector(readyForVoteSubscribedFilter(id));

    const vote = useSelector(voteFilter(id));

    const { ref } = useSwipeable({
        onSwipedLeft : (evt) => {
            if (canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote && vote.fail) {
                history.push('/document/' + id );
            } else if (canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote && !vote.fail) {
                //TODO maybe do some view instead of clicking
                setToggleModel(!toggleModal);
           } else if( canEdit && canEdit.isOwner && ! canEdit.isReadyForVote) {
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
