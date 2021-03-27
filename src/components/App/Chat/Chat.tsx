import React from 'react';
import {Layout} from 'antd';
const { Header, Footer, Sider, Content } = Layout;

type Props = {}

const Chat: React.FC<Props> = () => (
    <Layout>
        <Sider>Sider</Sider>
        <Layout>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
        </Layout>
    </Layout>
)

export default Chat;