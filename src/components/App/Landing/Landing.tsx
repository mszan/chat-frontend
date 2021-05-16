import React, { useState } from 'react';
import classes from './Landing.module.scss';
import {Col, Divider, Row} from 'antd';
import LoginForm from './LoginForm/LoginForm';
import RegistrationForm from './RegistrationForm/RegistrationForm';
import Title from 'antd/lib/typography/Title';
import {isLoggedIn} from 'axios-jwt';
import {Link, useHistory} from 'react-router-dom';
import Logo from './Logo/Logo';

type Props = {}

const Chat: React.FC<Props> = () => {
    let history = useHistory();
    if (isLoggedIn()) { history.push('/chat') } // If user is already logged in, redirect to /chat.
    const [formSwitched, setFormSwitched] = useState<boolean>(false) // If true register form is shown.

    return (
        <Row className={classes.wrapper} justify="center" align="middle">
            <Col xs={18} sm={12} md={8} lg={6}>
                <Logo />
                <Title className={classes.title}>Chat App</Title>
                <Divider />
                {formSwitched ? <RegistrationForm /> : <LoginForm />}
                <Link to="" onClick={() => setFormSwitched(!formSwitched)}>{formSwitched ? 'I already have an account' : 'I need an account'}</Link>
            </Col>
        </Row>
    )
}

export default Chat;