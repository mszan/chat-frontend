import React from 'react';
import {Button, Col, Divider, Form, Input, PageHeader, Row, Spin} from 'antd';
import {useHistory} from 'react-router-dom';
import {LockOutlined} from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import Paragraph from 'antd/es/typography/Paragraph';


interface Props {}

const JoinRoom: React.FC<Props> = () => {
    let history = useHistory();

    /**
     * Gets executed when form is submitted successfully.
     */
    const onFormFinish = () => {
        console.log('y')
    }

    return (
        <React.Fragment>
            <Row>
                <Col style={{width: '100%'}}>
                    <PageHeader style={{padding: 0}} title="Join room"/>
                    <Paragraph>
                        From here you can join new rooms. You need an invite key to do that.
                    </Paragraph>
                    <Divider />
                </Col>
            </Row>
        <Row>
            <Col span={24}>
                <Form onFinish={onFormFinish} layout="vertical">
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
