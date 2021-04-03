import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Empty, message, PageHeader, Row, Skeleton, Spin, Statistic, Tag} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import axiosBackend from '../../../../../services/axios-backend';
import Message from './Message/Message';
import Text from 'antd/es/typography/Text';

// User message type.
type TMessage = {
    id: number,
    room: string,
    user: string,
    text: string,
    timestamp: string,
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
    const [fetchRoomCompleted, setFetchRoomCompleted] = useState<boolean>(false)    // Room fetch status.

    // Fetches specific room details from API.
    const fetchRoom = () => {
        // Call API for room.
        axiosBackend.get(`/rooms/${roomId}`)
            // If success, update roomList state.
            .then(r => {
                setRoom(r.data);
                setFetchRoomCompleted(true);
            })
            // If error, log details to console.
            .catch(e => {
                console.log(e)  // Log details to console.

                history.push('/chat')  // Redirect to login page.
                message.error({
                    content: <span>Unable to fetch room ID <strong>{roomId}</strong>.</span>,
                    duration: 10
                });
            })
    }

    useEffect(() => {
        fetchRoom()
    }, [])

    return (
        <React.Fragment>
            <Row>
                <Col span={24}>
                    <PageHeader
                        style={{padding: 0}}
                        title={room.name ? <Text strong>{room.name}</Text> : <Spin />}
                        tags={<Tag color="blue">Foo</Tag>}
                        extra={[
                            <Button key="3">Operation</Button>,
                            <Button key="2">Operation</Button>,
                            <Button key="1" type="primary">
                                Primary
                            </Button>
                        ]}
                    />
                    <Divider />
                </Col>
            </Row>
            {/* Check if there are messages in room. */}
            {room.messages && room.messages.length > 0 ?
                // If so, render messages.
                room.messages.map((msg, index, array) => {
                return (
                    <Row justify={msg.user == localStorage.getItem('loggedUserUsername') ? 'end' : 'start'}>
                        <Col>
                            <Message msg={msg} nextMsg={array[index + 1]}/>
                        </Col>
                    </Row>
                )
            }) :
                // Else, check if fetching is completed.
                <Row justify="center">
                    <Col>
                        {fetchRoomCompleted ? <Empty description="Room history is empty so far."/> : <Spin />}
                    </Col>
                </Row>
            }
        </React.Fragment>
    )
}

export default Room;