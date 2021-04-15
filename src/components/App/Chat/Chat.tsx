import React, {useState} from 'react';
import {Layout} from 'antd';
import classes from './Chat.module.scss';
import ChatContent from './ChatContent/ChatContent';
import ChatHeader from './ChatHeader/ChatHeader';
import ChatSider from './ChatSider/ChatSider';

// Room menu item on sider.
export type IRoomOnSider = {
    id: number,
    url: string,
    name: string,
    active: boolean,
}

interface Props {}

const Chat: React.FC<Props> = () => {
    // Get sider collapse state from localStorage.
    const getSiderCollapsedLocalStorage = () => {
        // LocalStorage value.
        const localStorageVal = localStorage.getItem('siderCollapsed')

        // If localStorage value is present and its value is 'true'.
        return !!(localStorageVal && localStorageVal === 'true');
    }

    // State of collapsed sider.
    const [siderCollapsedState, setSiderCollapseState] = useState<boolean>(getSiderCollapsedLocalStorage())

    // Set localStorage and state to negation of previous state (true -> false OR false -> true).
    const setSiderCollapsed = () => {
        const negation = !getSiderCollapsedLocalStorage()   // Boolean.
        localStorage.setItem('siderCollapsed', String(negation)); // String.
        setSiderCollapseState(negation);    // Boolean.
    }

    // List of fetched rooms to be displayed on the sidebar.
    const [roomList, setRoomList] = useState<Array<IRoomOnSider>>([]);


    return (
        <Layout className={classes.wrapper}>
            <ChatSider siderCollapsed={siderCollapsedState} roomList={roomList} setRoomList={setRoomList}/>
            <Layout>
                <ChatHeader siderCollapsed={siderCollapsedState} setSiderCollapsed={setSiderCollapsed} />
                <ChatContent roomList={roomList} setRoomList={setRoomList} />
            </Layout>
        </Layout>
    )
}

export default Chat;