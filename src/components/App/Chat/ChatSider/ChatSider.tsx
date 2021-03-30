import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axiosBackend from '../../../../services/axios-backend';
import classes from './ChatSider.module.scss';
import {Menu} from 'antd';
import {MessageOutlined} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';


type IRoom = {
    url: string,
    name: string,
    active: boolean,
    creator: string,
    admins: string[],
    users: string[]
}

interface Props {
    sidebarCollapsed: boolean;
}

const ChatSider: React.FC<Props> = ({sidebarCollapsed}) => {
    // List of fetched rooms to be displayed on the sidebar.
    const [roomList, setRoomList] = useState<Array<IRoom>>([])

    useEffect(() => {
        fetchRooms()
    }, [])

    // Fetches room list from backend API.
    const fetchRooms = () => {
        // Call API for room list.
        axiosBackend.get('/rooms/')
            // If success, update roomList state.
            .then(r => {
                setRoomList(r.data)
            })
            // If error, log details to console.
            .catch(e => console.log(e))
    }

    // Returns sidebar room icon.
    // TODO: Will be returning different icon if there are new messages in room.
    const getRoomIcon = () => {
        return (<MessageOutlined />)
    }

    return (
        <Sider
            className={classes.wrapper}
            trigger={null}
            collapsible
            collapsed={sidebarCollapsed}
            collapsedWidth={window.innerWidth < 400 ? 0 : 80}
        >
            <div key="siderLogo" className={classes.logo}>
                <Link to="">
                    LOGO
                </Link>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {roomList.map(room => {
                    return (
                        <Menu.Item key={room.url} icon={getRoomIcon()}>
                            {room.name}
                        </Menu.Item>
                    )
                })}
            </Menu>
        </Sider>
    )
}

export default ChatSider;