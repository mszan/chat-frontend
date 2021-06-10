import React, {useEffect, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import axiosBackend from '../../../../services/axios-backend';
import classes from './ChatSider.module.scss';
import {Avatar, Menu} from 'antd';
import {CoffeeOutlined} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import {IRoomOnSider} from '../Chat';
import useWindowWidth from '../../../../hooks/useWindowWidth';

interface Props {
    siderCollapsed:  boolean;
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const ChatSider: React.FC<Props> = ({siderCollapsed, roomList, setRoomList}) => {
    let location = useLocation();

    // Get sider box-shadow style value.
    const getSiderShadow = () => { return siderCollapsed ? '0 0 17px 0 rgba(0,0,0,0.1)' : '0 0 17px 0 rgba(0,0,0,0.5)';}

    // Takes location and splits current path to get menu item id.
    let currentSiderMenuItemKey: string = location.pathname.split('/').pop() as string

    // Gets called only once at page load.
    useEffect(() => {
        fetchRooms();
    }, [])

    /**
     * Fetches room list from backend API.
     */
    const fetchRooms = () => {
        axiosBackend.get('/rooms?fields=id,url,name,active&active=true')
            .then(r => {
                setRoomList(r.data);
            })
            .catch(e => console.log(e))
    }

    // Used to handle siderbar collapse state when user resizes the window.
    let windowWidth = useWindowWidth();

    const [siderCollapsedWidth, setSiderCollapsedWidth] = useState<number>(windowWidth);

    useEffect(() => {
        windowWidth < 768 ? setSiderCollapsedWidth(0) : setSiderCollapsedWidth(80);
    }, [windowWidth]);

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={siderCollapsed}
            collapsedWidth={siderCollapsedWidth}
            style={{boxShadow: getSiderShadow()}}
        >
            <div key="siderLogo" className={classes.logo}>
                <Link to="">
                    <CoffeeOutlined className={classes.logoIcon}/>
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
                            className={classes.menuItem}
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
                    className={classes.menuItem}
                    icon={<Avatar className={classes.menuItemCreateRoomIcon}>+</Avatar>}
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