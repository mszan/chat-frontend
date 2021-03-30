import React from 'react';
import {Layout } from 'antd';

const { Content } = Layout;

interface Props {}

const ChatContent: React.FC<Props> = () => {
    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
            }}
        >
            Content
        </Content>
    )
}

export default ChatContent;