import React from 'react';
import classes from './Landing.module.scss';
import {Col, Divider, Image, Row} from 'antd';
import LoginForm from './LoginForm/LoginForm';
import Title from 'antd/lib/typography/Title';
import {CoffeeOutlined} from '@ant-design/icons';
import { login } from '../../../services/auth';

type Props = {}

const Chat: React.FC<Props> = () => {
    login({
        'username': 'admin',
        'password': 'admin'
    })
        .then(r => console.log(r))
        .catch(e => console.log(e))
    return (
        <Row
            className={classes.wrapper}
            justify="center"
            align="middle"
        >
            <Col span={6}>
                <CoffeeOutlined className={classes.logo}/>
                <Title className={classes.title}>Chat App</Title>
                <Divider />
                <Title className={classes.subtitle} level={5}>Please login.</Title>
                <LoginForm />
            </Col>
        </Row>
    )
}

export default Chat;