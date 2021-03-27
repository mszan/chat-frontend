import React from 'react';
import classes from './Landing.module.scss';
import {Col, Divider, Row} from 'antd';
import LoginForm from './LoginForm/LoginForm';
import Title from 'antd/lib/typography/Title';

type Props = {}

const Chat: React.FC<Props> = () => (
    <Row
        className={classes.wrapper}
        justify="center"
        align="middle"
    >
        <Col span={6}>
            <Title className={classes.title}>Welcome to Chat App</Title>
            <Divider />
            <Title className={classes.subtitle} level={5}>Please login.</Title>
            <LoginForm />
        </Col>
    </Row>
)

export default Chat;