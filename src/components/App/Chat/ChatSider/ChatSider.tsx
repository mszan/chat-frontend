import React, {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import axiosBackend from '../../../../services/axios-backend';
import classes from './ChatSider.module.scss';
import {Avatar, Menu} from 'antd';
import {CoffeeOutlined} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';

// Type for list on sider.
type IRoomOnSider = {
    id: number,
    url: string,
    name: string,
    active: boolean,
}

interface Props {
    siderCollapsed:  boolean;
}

const ChatSider: React.FC<Props> = ({siderCollapsed}) => {
    // List of fetched rooms to be displayed on the sidebar.
    const [roomList, setRoomList] = useState<Array<IRoomOnSider>>([]);

    // Get sider box-shadow style value.
    const getSiderShadow = () => { return siderCollapsed ? '0 0 17px 0 rgba(0,0,0,0.1)' : '0 0 17px 0 rgba(0,0,0,0.5)';}

    // Sider shadow based on its collapse state.
    const [siderShadow, setSiderShadow] = useState<string>(getSiderShadow());

    // Only once at page load.
    useEffect(() => {
        fetchRooms();
    }, [])

    useEffect(() => {
        setSiderShadow(getSiderShadow());
    })

    // Fetches room list from backend API.
    const fetchRooms = () => {
        // Call API for room list.
        axiosBackend.get('/rooms?fields=id,url,name,active')
            // If success, update roomList state.
            .then(r => {
                setRoomList(r.data);
            })
            // If error, log details to console.
            .catch(e => console.log(e))
    }

    return (
        <Sider
            className={classes.wrapper}
            trigger={null}
            collapsible
            collapsed={siderCollapsed}
            collapsedWidth={window.innerWidth < 400 ? 0 : 80}
            style={{boxShadow: siderShadow}}
        >
            <div key="siderLogo" className={classes.logo}>
                <Link to="">
                    <CoffeeOutlined style={{fontSize: '1.5rem'}}/>
                </Link>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {/*Existing room items.*/}
                {roomList.map(room => {
                    return (
                        <Menu.Item
                            key={room.url}
                            icon={
                                <Avatar style={{lineHeight: '32px'}}>{room.name[0].toUpperCase()}</Avatar>
                            }
                            style={{paddingLeft: '24px'}}
                        >
                            <NavLink to={`/chat/rooms/${room.id}`}>
                                {room.name}
                            </NavLink>
                        </Menu.Item>
                    )
                })}
                {/*Create new room item.*/}
                <Menu.Item
                    key="create-room-menu-item"
                    icon={
                        <Avatar
                            style={{
                                lineHeight: '32px',
                                backgroundColor: '#fa898b'
                            }}
                        >F</Avatar>
                    }
                    style={{paddingLeft: '24px'}}
                >
                    <NavLink to={`/chat/rooms/create`}>
                        Create room
                    </NavLink>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default ChatSider;