import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Empty, Input, message, PageHeader, Row, Spin, Tag} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import axiosBackend from '../../../../../services/axios-backend';
import Message from './Message/Message';
import Text from 'antd/es/typography/Text';
import InfiniteScroll from 'react-infinite-scroll-component';

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
}

interface Props {}

const Room: React.FC<Props> = () => {
    let history = useHistory();
    let {roomId} = useParams<{roomId: string}>();   // Room ID router parameter.
    const [room, setRoom] = useState<TRoom>({} as TRoom)    // Room details (title, messages etc).

    const [messages, setMessages] = useState<Array<TMessage>>([] as Array<TMessage>)    // Room messages.
    const [messagesFetchURL, setMessagesFetchURL] = useState<string>(`/messages?room_id=${roomId}&offset=0`) // API url for messages.
    const [fetchFirstMessagesCompleted, setFetchFirstMessagesCompleted] = useState<boolean>(false)    // First messages fetch status.
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true)    // Is there more messages to fetch.

    // Fetches specific room details from API.
    const fetchRoom = () => {
        // Call API for room.
        axiosBackend.get(`/rooms/${roomId}`)
            // If success, update roomList state.
            .then(r => {
                setRoom(r.data);    // Room details.
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

    // Fetches messages from API.
    const fetchMessages = () => {
        console.log('fetchMessages RUN')

        // Call API for room.
        axiosBackend.get(messagesFetchURL)
            // If success, update messages state.
            .then(r => {
                // Map messages (or add new messages) to state.
                r.data.results.map((newMsg: TMessage) => {
                    setMessages(messages => [...messages, newMsg]);
                })

                // If there is no previous link, it means this is first fetch.
                if (!r.data.previous) { setFetchFirstMessagesCompleted(true); }

                // If there is more messages to fetch, set URL for next messages request.
                if (r.data.next) { setMessagesFetchURL(r.data.next); }
                else { setHasMoreMessages(false); }
            })
            // If error, log details to console.
            .catch(e => {
                console.log(e)  // Log details to console.

                history.push('/chat')  // Redirect to login page.
                message.error({
                    content: <span>Unable to fetch messages for room ID <strong>{roomId}</strong>.</span>,
                    duration: 10
                });
            })
    }

    useEffect(() => {
        fetchRoom();
        fetchMessages();
    }, [])

    return (
        <div style={{position: 'relative', height: 'calc(100vh - 120px)'}}>
            <Row>
                <Col style={{width: '100%'}}>
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
            <Row>
                <Col span={24}>
                    <div
                        id="scrollableDiv"
                        style={{
                            height: '70vh',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                        }}
                    >
                        <InfiniteScroll
                            dataLength={messages.length}
                            next={fetchMessages}
                            hasMore={hasMoreMessages}
                            loader={<Row justify="center"><Col><Spin /></Col></Row>}
                            inverse={true}
                            style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                            scrollableTarget="scrollableDiv"

                        >
                            {messages && messages.length > 0 ?
                                messages.map((msg, index, array) => {
                                    return (
                                        <Message
                                            msg={msg}
                                            renderAvatar={true} // TODO: Determinate if avatar should be rendered.
                                            // If user didn't change, don't re-render same avatar.
                                        />
                                    )
                                }) :
                                <Row justify="center" align="middle" style={{height: '70vh'}}>
                                    <Col>
                                        {fetchFirstMessagesCompleted ?
                                            <Empty description="Room history is empty so far."/> :
                                            <React.Fragment>
                                                <Spin/>
                                            </React.Fragment>
                                        }
                                    </Col>
                                </Row>
                            }
                        </InfiniteScroll>
                    </div>
                </Col>
            </Row>
            <Row style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <Col span={24}>
                    <Divider />
                    <Input placeholder="Basic usage" />
                </Col>
            </Row>
        </div>
    )
}

export default Room;