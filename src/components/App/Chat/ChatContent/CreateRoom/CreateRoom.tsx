import React from 'react';
import {Col, Divider, PageHeader, Row} from 'antd';
import classes from './CreateRoom.module.scss';
import CreateRoomForm from './CreateRoomForm/CreateRoomForm';
import {IRoomOnSider} from '../../Chat';
import { Link } from 'react-router-dom';

interface Props {
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const CreateRoom: React.FC<Props> = ({roomList, setRoomList}) => {
    return (
        <div className={classes.wrapper}>
            <Row>
                <Col className={classes.headerCol}>
                    <PageHeader
                        className={classes.header}
                        title="Create new room"
                    />
                    <Divider />
                </Col>
            </Row>
            <Row>
                <Col xs={18} sm={12} md={8} lg={6}>
                    <CreateRoomForm roomList={roomList} setRoomList={setRoomList}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/chat/rooms/join">I have an invite key</Link>
                </Col>
            </Row>
        </div>
    )
}

export default CreateRoom;
