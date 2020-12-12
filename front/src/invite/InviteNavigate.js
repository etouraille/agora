import React from 'react';

import { useParams } from "react-router";
import Invite from "./Invite";

const InviteNavigate = () => {
    const { id } = useParams();

    return (
        <>
            <Invite id={id}></Invite>
        </>
    )
}
export default InviteNavigate;