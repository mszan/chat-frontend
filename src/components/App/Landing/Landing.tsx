import React from 'react';
import classes from './Landing.module.scss';
import {Col, Divider, Row} from 'antd';
import LoginForm from './LoginForm/LoginForm';
import Title from 'antd/lib/typography/Title';
import {CoffeeOutlined} from '@ant-design/icons';
import {isLoggedIn} from 'axios-jwt';
import {useHistory} from 'react-router-dom';

type Props = {}

const Chat: React.FC<Props> = () => {
    let history = useHistory();
    if (isLoggedIn()) { history.push('/chat') } // If user is already logged in, redirect to /chat.

    return (
        <Row className={classes.wrapper} justify="center" align="middle">
            <Col xs={18} sm={12} md={8} lg={6}>
                <CoffeeOutlined className={classes.logo}/>
                <Title className={classes.title}>Chat App</Title>
                <Divider />
                <Title className={classes.subtitle} level={5}>Please login to enter.</Title>
                <LoginForm />
            </Col>
        </Row>
    )
}

export default Chat;