import {Button, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {login} from '../../../../services/auth';
import {useHistory} from 'react-router-dom';

interface Props {}

const LoginForm: React.FC<Props> = () => {
    // Login button loading state.
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const history = useHistory();
    // Handles login form onFinish.
    const onFinish = (values: {username: string, password: string}) => {
        setButtonLoading(true);

        login({
            'username': values.username,
            'password': values.password
        })
            .then(() => {
                message.success('You are logged in now.');
                history.push('/chat');
            })
            .catch(e => {
                message.error('Try again.');

                // To prevent multiple login attempts, enable button after certain time.
                setTimeout(() => setButtonLoading(false), 1000);

                console.log(e);
            });
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username.',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password.',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={buttonLoading}>
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;