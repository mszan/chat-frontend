import React, {useState} from 'react';
import {Layout, Typography} from 'antd';
import classes from './Chat.module.scss';
import ChatContent from './ChatContent/ChatContent';
import ChatHeader from './ChatHeader/ChatHeader';
import ChatSider from './ChatSider/ChatSider';

interface Props {}

const Chat: React.FC<Props> = () => {
    // ChatSider collapse state.
    //      True - sidebar collapsed (desktop) / hidden (mobile).
    //      False - visible.
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)


    return (
        <Layout className={classes.wrapper}>
            <ChatSider sidebarCollapsed={sidebarCollapsed} />
            <Layout>
                <ChatHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
                <ChatContent />
            </Layout>
        </Layout>
    )
}

export default Chat;