import React from 'react';
import {Layout} from 'antd';
import Room from './Room/Room';
import {Route, Switch} from 'react-router-dom';
import CreateRoom from './CreateRoom/CreateRoom';
import {IRoomOnSider} from '../Chat';

const { Content } = Layout;

interface Props {
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const ChatContent: React.FC<Props> = ({roomList, setRoomList}) => {
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
                    <CreateRoom roomList={roomList} setRoomList={setRoomList} />
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