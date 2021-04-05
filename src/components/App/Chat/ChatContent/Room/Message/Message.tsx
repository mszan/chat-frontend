import React from 'react';
import {Avatar, Card, Col, Row, Tooltip} from 'antd';
import moment from 'moment';

// User message type.
type TMessage = {
    id: number,
    room: string,
    user: string,
    text: string,
    timestamp: string,
}

interface Props {
    renderAvatar: boolean,
    msg: TMessage
}

const Message: React.FC<Props> = ({renderAvatar, msg}) => {
    // Return true if message user matches loggedUserUsername localStorage string.
    const isMsgSentByLoggedUser = () => { return msg.user == localStorage.getItem('loggedUserUsername');}

    // Get user avatar (profile picture) or span placeholder.
    const getAvatar = () => {
        if (renderAvatar) {
            return (
                <Col>
                    <Tooltip placement="bottom" title={msg.user}>
                        <Avatar size="small" style={{
                            margin: isMsgSentByLoggedUser() ? '0 0 2px 5px' : '0 5px 2px 0'
                        }} >
                            {msg.user[0].toUpperCase()}
                        </Avatar>
                    </Tooltip>
                </Col>
            )
        } else {
            return (
                <Col>
                    <div style={{width: 29}} />
                </Col>
            )
        }
    }

    return (
        <Row align="bottom" justify={isMsgSentByLoggedUser() ? 'end' : 'start'}>
            {isMsgSentByLoggedUser() ? null : getAvatar()}
            <Col>
                <Tooltip placement="bottom" title={moment(msg.timestamp).fromNow()} mouseEnterDelay={0.5}>
                    <Card
                        style={{
                            width: 300,
                            backgroundColor: isMsgSentByLoggedUser() ? '#ffdddd' : '#ffffff',
                            borderRadius: 5,
                            marginTop: 5
                        }}
                        bodyStyle={{
                            padding: 10,
                        }}
                    >
                        {/*<span>{msg.timestamp}</span>*/}
                        <span>{msg.text}</span>
                    </Card>
                </Tooltip>
            </Col>
            {isMsgSentByLoggedUser() ? getAvatar() : null}
        </Row>
    )
}

export default Message;