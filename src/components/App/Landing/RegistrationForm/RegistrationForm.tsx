import { Button, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { login, register } from '../../../../services/auth'

type Props = {}

const RegistrationForm: React.FC<Props> = () => {
  // Register button loading state.
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  let history = useHistory()
  // Handles register form onFinish.
  const onFinish = (values: any) => {
    setButtonLoading(true)

    register({
      username: values.username,
      password1: values.password1,
      password2: values.password2,
      email: values.email,
    })
      .then(() => {
        login({
          username: values.username,
          password: values.password1,
        })
            .then(() => {
                message.success(
                    'Account created successfully. You just got logged in.',
                )
                history.push('/chat');
            })
            .catch(() => {
                message.error('We could not log you in directly after account creation. Try logging in manually.');
            })
      })
      .catch((e) => {
        message.error('Something went wrong, try again.')
        console.error(e)
        setTimeout(() => setButtonLoading(false), 1000)
      });
  }

  return (
    <Form
      name="normal_registration"
      className="registration-form"
      initialValues={{ remember: true }}
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
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password1"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input your password.',
          },
          {
            min: 8,
            message: 'Password is too short.',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="password2"
        dependencies={['password1']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password.',
          },
          {
            min: 8,
            message: 'Password is too short.',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password1') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('Passwords do not match.'),
              )
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Repeat password"
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid e-mail.',
          },
          {
            required: true,
            message: 'Please input your e-mail.',
          },
        ]}
      >
        <Input prefix={<MailOutlined />} type="email" placeholder="E-mail" />
      </Form.Item>
      <Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          noStyle
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
        >
          <Checkbox>
            I have read <a href="#">the agreement</a>
          </Checkbox>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={buttonLoading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegistrationForm
