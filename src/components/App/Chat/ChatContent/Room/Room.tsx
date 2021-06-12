import InfiniteScroll from 'react-infinite-scroll-component';
import InvitesModal from './InvitesModal/InvitesModal';
import Message, {TMessage} from './Message/Message';
import React, {ReactElement, useEffect, useState} from 'react';
import SettingsModal from './SettingsModal/SettingsModal';
import Text from 'antd/es/typography/Text';
import axiosBackend from '../../../../../services/axios-backend';
import classes from './Room.module.scss';
import moment from 'moment';
import {Button, Col, Divider, Empty, Input, message, PageHeader, Row, Spin, Tag} from 'antd';
import {CrownOutlined, LikeOutlined, SendOutlined, ToolOutlined, UserAddOutlined, SettingOutlined} from '@ant-design/icons';
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

    // SettingsModal modal visibility.
    const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);

    // InvitesModal modal visibility.
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
    const sendMessage = (event?: React.FormEvent<EventTarget>) => {
        // Prevent page reload on form submit.
        if (event) {
            event.preventDefault();
        }

        if (messageInputValue.length === 0) {
            message.error({
                content: <span>Message can't be empty.</span>,
                duration: 3
            });
        } else if (messageInputValue.length > 500) {
            message.error({
                content: <span>Message is too long. It must be not longer than 500 characters.</span>,
                duration: 3
            });
        } else {
            roomWebSocket?.send(JSON.stringify({
                'username': localStorage.getItem('loggedUserUsername'),
                'message': messageInputValue
            }))
            setMessageInputValue('');
        }
        
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
            <Tag color={item.color}>
                {item?.icon ? React.createElement(item.icon) : null}
                <span className={classes.tagSpan}>{item.text}</span>
            </Tag>
        ));
    }

    /**
     * Tells whether user is present in room's 'users' field.
     */
    const isUserRoomParticipant = () : boolean => {
        return room!.users.includes(localStorage.getItem('loggedUserUsername')!)
    }


    /**
     * Waits for room to be fetched.
     * After room is fetched, it calls other room dependencies (messages, tags etc.).
     */
    useEffect(() => {
        if (!room) {
            fetchRoom();
        } else {
            // If user is not participant of this room, redirect outside the room.
            if (!isUserRoomParticipant()) {
                message.error({
                    content: <span>You are not a participant of this room. <strong>If you have an invite key, insert it below.</strong></span>,
                    duration: 3
                });
                history.push('/chat/rooms/join');
            }

            setRoomTags(getRoomTags())
            fetchMessages();
            runRoomWebSocket();
        }
    }, [room])


    return (
        <div className={classes.wrapper}>
            <SettingsModal roomId={parseInt(roomId)} setModalVisible={setSettingsModalVisible} modalVisible={settingsModalVisible}/>
            <InvitesModal roomId={parseInt(roomId)} setModalVisible={setInvitesModalVisible} modalVisible={invitesModalVisible}/>
            <Row>
                <Col className={classes.headerCol}>
                    <PageHeader
                        className={classes.header}
                        title={room?.name ? <Text strong>{room?.name}</Text> : <Spin />}
                        tags={roomTags}
                        extra={[
                            <Button key="1" type="primary" onClick={() => setInvitesModalVisible(true)}>
                                <UserAddOutlined />
                                <span className={classes.btnSpan}>Invites</span>
                            </Button>,
                            <Button key="2" onClick={() => setSettingsModalVisible(true)}>
                                <SettingOutlined />
                                <span className={classes.btnSpan}>Room settings</span>
                            </Button>
                        ]}
                    />
                    <Divider />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div id="scrollableDiv" className={classes.scrollableDiv}>
                        <InfiniteScroll
                            dataLength={messages.length}
                            next={fetchMessages}
                            hasMore={hasMoreMessages}
                            loader={<Row justify="center"><Col><Spin /></Col></Row>}
                            inverse={true}
                            className={classes.infiniteScroll}
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
                                <Row justify="center" align="middle" className={classes.noChatHistoryRow}>
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
            <form onSubmit={sendMessage}>
                <Row className={classes.footer}>
                    <Col flex="auto">
                        <Input
                            className={classes.input} placeholder="Type a message..."
                            onChange={event => setMessageInputValue(event.target.value)}
                            value={messageInputValue}
                        />
                    </Col>
                    <Col flex="26px">
                        {/* {React.createElement(messageInputValue === '' ? LikeOutlined : SendOutlined, {
                            className: classes.sendBtn,
                            onClick: () => {
                                if (messageInputValue === '') {
                                    setMessageInputValue(String.fromCodePoint(0x1F44D));
                                }

                                setTimeout(() => sendMessage(), 2000);
                            },
                        })} */}
                        {React.createElement(SendOutlined, {
                            className: classes.sendBtn,
                            onClick: () => sendMessage(),
                        })}
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default Room;
