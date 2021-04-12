import React from 'react';
import {Button, Col, Divider, PageHeader, Row, Tag} from 'antd';
import classes from './CreateRoom.module.scss';
import CreateRoomForm from './CreateRoomForm/CreateRoomForm';


// Room type.
type TRoom = {
    id: number,
    url: string,
    name: string,
    active: boolean,
    creator: string,
    admins: string[],
    users: string[],
}

interface Props {}

const CreateRoom: React.FC<Props> = () => {
    return (
        <div className={classes.wrapper}>
            <Row>
                <Col style={{width: '100%'}}>
                    <PageHeader
                        style={{padding: 0}}
                        title="Create new room"
                    />
                    <Divider />
                </Col>
            </Row>
            <Row>
                <Col xs={18} sm={12} md={8} lg={6}>
                    <CreateRoomForm />
                </Col>
            </Row>
        </div>
    )
}

export default CreateRoom;
