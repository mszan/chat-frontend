import {Button, Form, Input} from 'antd';
import {TagOutlined} from '@ant-design/icons';
import React, {useState} from 'react';

const CreateRoomForm = () => {
    // const [form] = Form.useForm();

    // Login button loading state.
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item
                label="Room name:"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input room name.',
                    },
                ]}
            >
                <Input placeholder="Zone 22" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={buttonLoading}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateRoomForm;