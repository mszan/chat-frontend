import React from 'react';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import Link from 'antd/lib/typography/Link';
import {Link as RouterLink} from 'react-router-dom';
import { Divider } from 'antd';

interface Props {}

const Welcome: React.FC<Props> = () => {
    return (
        <React.Fragment>
            <Title>Welcome to Chat App</Title>
            <Title level={5}>
            This app is in its very early stage, please be forgiving.
            </Title>
            <Divider />
            <Paragraph>
                To get started, use the sider on your left to create a new room. From there you will be able to invite the others and chat with them in real-time.
            </Paragraph>
            <Paragraph>
                Hopefully someday I will evolve this app into something useful.
            </Paragraph>
            <RouterLink to="/chat/rooms/join">
                I have an invite key
            </RouterLink>
            <Divider />
            <Link href="https://github.com/mszan/chat-app" target="_blank">
                GitHub
            </Link>
        </React.Fragment>
    )
}

export default Welcome;
