import React, { useEffect, useState } from 'react';
import {Button, Col, Divider, Form, Input, message, PageHeader, Row} from 'antd';
import {useHistory, useLocation} from 'react-router-dom';
import {LockOutlined} from '@ant-design/icons';
import Paragraph from 'antd/es/typography/Paragraph';
import axiosBackend from '../../../../../services/axios-backend';
import classes from './JoinRoom.module.scss';


interface Props {}

const JoinRoom: React.FC<Props> = () => {
    let history = useHistory();
    const [form] = Form.useForm();

    // A custom hook that builds on useLocation to parse the query string.
    let queryString = new URLSearchParams(useLocation().search);

    // Invite key string. Initial value checks for query string parameter 'key'.
    const [inviteKey, setInviteKey] = useState<string | null>(queryString.get('key'));

    /**
     * Gets called when form is submitted successfully.
     */
    const onFormFinish = (values: any) => {
        setInviteKey(values.inviteKey);
    }

    /**
     * Sends invite key to backend API that handles joining user to specific room.
     */
    const sendInviteKey = () => {
        axiosBackend.post(`/rooms-join/${inviteKey}/`)
            .then(r => {
                message.success({
                    content: <span>Successfully joined room ID <strong>{r.data.room_id}</strong>.</span>,
                    duration: 2
                });
                history.push(`/chat/rooms/${r.data.room_id}`);
            })
            .catch(e => {
                console.log(e.response.data)
                message.error({
                    content: <span>Unable to join room ID. <strong>{e.response.data.msg}</strong></span>,
                    duration: 5
                });
                setInviteKey(null);
                form.resetFields();
            })
    }

    useEffect(() => {
        if (inviteKey) {
            sendInviteKey();
        }
    }, [inviteKey])

    return (
        <React.Fragment>
            <Row>
                <Col className={classes.headerCol}>
                    <PageHeader className={classes.header} title="Join room"/>
                    <Paragraph>
                        From here you can join new rooms. You need an invite key to do that.
                    </Paragraph>
                    <Divider />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form form={form} onFinish={onFormFinish} layout="vertical">
                        <Form.Item
                            label="Invite key"
                            name="inviteKey"
                            rules={[{ required: true, message: 'Please input invite key!' }]}
                        >
                            <Input prefix={<LockOutlined />} placeholder="e.g. seWol4BihReSkKu3cwCy" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Join
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default JoinRoom;
