import React from 'react';
import {Avatar, Card, Col, Row, Tooltip} from 'antd';
import {useHistory} from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';
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
    nextMsg: TMessage | undefined,
    msg: TMessage
}

const Message: React.FC<Props> = ({nextMsg, msg}) => {
    // Return true if message user matches loggedUserUsername localStorage string.
    const isMsgSentByLoggedUser = () => { return msg.user == localStorage.getItem('loggedUserUsername');}

    // Get user avatar (profile picture).
    const getAvatar = () => {
        if (!nextMsg || nextMsg.user != msg.user) {
            return (
                <Col>
                    <Tooltip placement="bottom" title={msg.user}>
                        <Avatar size="small" style={{
                            margin: isMsgSentByLoggedUser() ? '0 0 0 5px' : '0 5px 0 0'
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
        <Row align="bottom">
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
                        {console.log(nextMsg, msg)}
                    </Card>
                </Tooltip>
            </Col>
            {isMsgSentByLoggedUser() ? getAvatar() : null}
        </Row>
    )
}

export default Message;