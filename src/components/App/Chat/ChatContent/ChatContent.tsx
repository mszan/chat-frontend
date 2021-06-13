import React from 'react';
import {Layout} from 'antd';
import Room from './Room/Room';
import {Route, Switch} from 'react-router-dom';
import CreateRoom from './CreateRoom/CreateRoom';
import {IRoomOnSider} from '../Chat';
import JoinRoom from './JoinRoom/JoinRoom';
import classes from './ChatContent.module.scss';
import Welcome from './Welcome/Welcome';

const { Content } = Layout;

interface Props {
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const ChatContent: React.FC<Props> = ({roomList, setRoomList}) => {
    return (
        <Content className={classes.wrapper}>
            {/*Chat switch.*/}
            <Switch>
                {/*Route for creating new room.*/}
                <Route path={`/chat/rooms/create`}>
                    <CreateRoom roomList={roomList} setRoomList={setRoomList} />
                </Route>

                {/*Route that displays room join form and redirects to joining room.*/}
                <Route path={`/chat/rooms/join`} key={document.location.href}>
                    <JoinRoom />
                </Route>

                {/*Route for existing rooms.*/}
                <Route path={`/chat/rooms/:roomId`} key={document.location.href}>
                    <Room />
                </Route>

                {/*Logged in welcome screen.*/}
                <Route path={`/chat`} exact key={document.location.href}>
                    <Welcome />
                </Route>
            </Switch>
        </Content>
    );
};

export default ChatContent;