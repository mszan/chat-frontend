import React from 'react';
import {Layout} from 'antd';
import Room from './Room/Room';
import {Route, Switch} from 'react-router-dom';
import CreateRoom from './CreateRoom/CreateRoom';

const { Content } = Layout;

interface Props {}

const ChatContent: React.FC<Props> = () => {
    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: '0 24px',
                minHeight: 280,
            }}
        >
            {/*Chat switch.*/}
            <Switch>
                {/*Route for creating new room.*/}
                <Route path={`/chat/rooms/create`}>
                    <CreateRoom />
                </Route>

                {/*Route for existing rooms.*/}
                <Route path={`/chat/rooms/:roomId`} key={document.location.href}>
                    <Room />
                </Route>
            </Switch>
        </Content>
    )
}

export default ChatContent;