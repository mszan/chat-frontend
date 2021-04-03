import React, {useEffect, useState} from 'react';
import {Col, message, Row} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import axiosBackend from '../../../../../services/axios-backend';

// User message type.
type TMessage = {
    id: number,
    room: string,
    user: string,
    text: string,
}


// Room type.
type TRoom = {
    id: number,
    url: string,
    name: string,
    active: boolean,
    creator: string,
    admins: string[],
    users: string[],
    messages: TMessage[]
}

interface Props {}

const Room: React.FC<Props> = () => {
    let history = useHistory();
    let {roomId} = useParams<{roomId: string}>();   // Room ID router parameter.
    const [room, setRoom] = useState<TRoom>({} as TRoom)    // Room details (title, messages etc).

    // Fetches specific room details from API.
    const fetchRoom = () => {
        // Call API for room.
        axiosBackend.get(`/rooms/${roomId}`)
            // If success, update roomList state.
            .then(r => {
                setRoom(r.data);
            })
            // If error, log details to console.
            .catch(e => {
                console.log(e)  // Log details to console.

                history.push('/chat')  // Redirect to login page.
                message.error({
                    content: <span>Unable to join room ID <strong>{roomId}</strong>.</span>,
                    duration: 10
                });
            })
    }

    useEffect(() => {
        fetchRoom()
    }, [])

    return (
        <Row>
            <Col>
                Room.tsx
                {roomId}
                {room.messages ? room.messages.map(msg => {
                    return (
                        <div>{msg.text}</div>
                    )
                }) : null}
            </Col>
        </Row>
    )
}

export default Room;