import InfiniteScroll from 'react-infinite-scroll-component';
import Invites from './Invites/Invites';
import Message, {TMessage} from './Message/Message';
import React, {ReactElement, useEffect, useState} from 'react';
import Settings from './Settings/Settings';
import Text from 'antd/es/typography/Text';
import axiosBackend from '../../../../../services/axios-backend';
import classes from './Room.module.scss';
import moment from 'moment';
import {Button, Col, Divider, Empty, Input, message, PageHeader, Row, Spin, Tag} from 'antd';
import {CrownOutlined, LikeOutlined, SendOutlined, ToolOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';
import {TagType} from 'antd/lib/tag';


export type TRoom = {
    id: number,
    url: string,
    name: string,
    active: boolean,
    creator: string,
    admins: string[],
    users: string[],
}

type TRoomTagProps = {
    icon?: typeof CrownOutlined,
    color: string,
    text: string,
}

interface Props {}

const Room: React.FC<Props> = () => {
    let history = useHistory();

    // Room ID router parameter.
    let {roomId} = useParams<{roomId: string}>();

    // Room details (title, messages etc).
    const [room, setRoom] = useState<TRoom | undefined>(undefined);

    // Room messages.
    const [messages, setMessages] = useState<Array<TMessage>>([] as Array<TMessage>);

    // API url for room messages.
    const [messagesFetchURL, setMessagesFetchURL] = useState<string>(`/messages?room_id=${roomId}&offset=0&fields=user,text,timestamp`);

    // First messages fetch status.
    const [fetchFirstMessagesCompleted, setFetchFirstMessagesCompleted] = useState<boolean>(false);

    // Is there more messages to fetch.
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

    // Settings modal visibility.
    const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);

    // Invites modal visibility.
    const [invitesModalVisible, setInvitesModalVisible] = useState<boolean>(false);

    // Message input element value.
    const [messageInputValue, setMessageInputValue] = useState<string>('');

    // Websocket instance.
    const [roomWebSocket, setRoomWebSocket] = useState<undefined | WebSocket>(undefined);

    // Room tags that are displayed next to room title.
    const [roomTags, setRoomTags] = useState<ReactElement<TagType> | ReactElement<TagType>[] | undefined>(undefined);


    /**
     * Websocket operations to be called after room fetch.
     */
    const runRoomWebSocket = () => {
        const tempWebSocket = new WebSocket(`${process.env.REACT_APP_BACKEND_WEBSOCKET_URL}${room!.id}/`);

        tempWebSocket.onclose = () => {console.error('Chat socket closed unexpectedly')};

        tempWebSocket.onmessage = e => {
            const data = JSON.parse(e.data);
            const username = data.username;
            const text = data.message;

            const newMsg: TMessage = {
                'user': username,
                'text': text,
                'timestamp': moment().format()
            }

            setMessages(messages => [newMsg, ...messages]);
        }

        setRoomWebSocket(tempWebSocket);
    }

    /**
     * Sends message to websocket.
     * @param event form submit event.
     */
    const sendMessage = (event: React.FormEvent<EventTarget>) => {
        event.preventDefault(); // Prevent page reload on form submit.

        roomWebSocket?.send(JSON.stringify({
            'username': localStorage.getItem('loggedUserUsername'),
            'message': messageInputValue
        }))

        setMessageInputValue('');
    }

    /**
     * Fetches specific room details from API.
     */
    const fetchRoom = () => {
        axiosBackend.get(`/rooms/${roomId}`)
            .then(r => {
                // If room is not active, redirect to another page and display message.
                if (r.data.active === false) {
                    message.error({
                        content: <span>Room ID <strong>{roomId}</strong> is NOT active.</span>,
                        duration: 10
                    });
                    history.push('/')
                }
                setRoom(r.data);
            })
            .catch(e => {
                console.log(e);
                message.error({
                    content: <span>Unable to fetch room ID <strong>{roomId}</strong>.</span>,
                    duration: 10
                });
                history.push('/chat');
            })
    }


    /**
     * Fetches messages from backend API.
     */
    const fetchMessages = () => {
        axiosBackend.get(messagesFetchURL)
            .then(r => {
                // Map messages (or add new messages) to state.
                r.data.results.map((newMsg: TMessage) => (
                    setMessages(messages => [...messages, newMsg])
                ));

                // If there is no previous link, it means this is first fetch.
                if (!r.data.previous) { setFetchFirstMessagesCompleted(true); }

                // If there is more messages to fetch, set URL for next messages request.
                if (r.data.next) { setMessagesFetchURL(r.data.next); }
                else { setHasMoreMessages(false); }
            })
            .catch(e => {
                console.log(e);
                history.push('/chat');
                message.error({
                    content: <span>Unable to fetch messages for room ID <strong>{roomId}</strong>.</span>,
                    duration: 10
                });
            });
    }

    /**
     * Returns array of room tags that are displayed next to room title.
     */
    const getRoomTags = () : ReactElement<TagType> | ReactElement<TagType>[] | undefined => {
        let tagsProps = new Array<TRoomTagProps>();
        if (room!.creator === localStorage.getItem('loggedUserUsername')) {
            tagsProps.push({
                icon: CrownOutlined,
                color: 'red',
                text: 'Creator',
            });
        }

        if (room!.admins.includes(localStorage.getItem('loggedUserUsername')!)) {
            tagsProps.push({
                icon: ToolOutlined,
                color: 'volcano',
                text: 'Admin',
            });
        }

        return tagsProps.map(item => (
            <Tag
                icon={item?.icon ? React.createElement(item.icon) : null}
                color={item.color}
            >
                {item.text}
            </Tag>
        ));
    }


    /**
     * Waits for room to be fetched.
     * After room is fetched, it calls other room dependencies (messages, tags etc.).
     */
    useEffect(() => {
        if (!room) {
            fetchRoom();
        } else {
            setRoomTags(getRoomTags())
            fetchMessages();
            runRoomWebSocket();
        }
    }, [room])

    return (
        <div className={classes.wrapper}>
            <Settings roomId={parseInt(roomId)} setModalVisible={setSettingsModalVisible} modalVisible={settingsModalVisible}/>
            <Invites roomId={parseInt(roomId)} setModalVisible={setInvitesModalVisible} modalVisible={invitesModalVisible}/>
            <Row>
                <Col style={{width: '100%'}}>
                    <PageHeader
                        style={{padding: 0}}
                        title={room?.name ? <Text strong>{room?.name}</Text> : <Spin />}
                        tags={roomTags}
                        extra={[
                            <Button key="1" type="primary" onClick={() => setInvitesModalVisible(true)}>
                                Invites
                            </Button>,
                            <Button key="2" onClick={() => setSettingsModalVisible(true)}>
                                Settings
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
                                messages.map((msg) => {
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
            <Row>
                <Col span={24}>
                    <Divider />
                </Col>
            </Row>
            <form onSubmit={sendMessage}>
                <Row className={classes.footer}>
                    <Col flex="auto">
                        <Input
                            style={{width: '100%'}} placeholder="Type a message..."
                            onChange={event => setMessageInputValue(event.target.value)}
                            value={messageInputValue}
                        />
                    </Col>
                    <Col flex="26px">
                        {React.createElement(messageInputValue === '' ? LikeOutlined : SendOutlined, {
                            className: classes.sendBtn,
                            onClick: () => console.log("btnClicked"),
                        })}
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default Room;
