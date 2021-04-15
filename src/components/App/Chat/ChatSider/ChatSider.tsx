import React, {useEffect} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import axiosBackend from '../../../../services/axios-backend';
import classes from './ChatSider.module.scss';
import {Avatar, Menu} from 'antd';
import {CoffeeOutlined} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import {IRoomOnSider} from '../Chat';


interface Props {
    siderCollapsed:  boolean;
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const ChatSider: React.FC<Props> = ({siderCollapsed, roomList, setRoomList}) => {
    // Get sider box-shadow style value.
    const getSiderShadow = () => { return siderCollapsed ? '0 0 17px 0 rgba(0,0,0,0.1)' : '0 0 17px 0 rgba(0,0,0,0.5)';}

    let location = useLocation();
    // Takes location and splits current path to get menu item id.
    let currentSiderMenuItemKey: string = location.pathname.split('/').pop() as string

    // Only once at page load.
    useEffect(() => {
        fetchRooms();
    }, [])

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
            style={{boxShadow: getSiderShadow()}}
        >
            <div key="siderLogo" className={classes.logo}>
                <Link to="">
                    <CoffeeOutlined style={{fontSize: '1.5rem'}}/>
                </Link>
            </div>
            <Menu theme="dark" mode="inline" selectedKeys={[currentSiderMenuItemKey]}>
                {/*Existing room items.*/}
                {roomList.map(room => {
                    return (
                        <Menu.Item
                            key={room.id}
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
                    key="create"
                    icon={
                        <Avatar
                            style={{
                                fontSize: '20px',
                                lineHeight: '31px',
                                backgroundColor: '#fa898b',
                            }}
                        >+</Avatar>
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