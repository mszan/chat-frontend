import React, {useState} from 'react';
import {Layout, Menu} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import classes from './Chat.module.scss'
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

type Props = {}

const Chat: React.FC<Props> = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

    return (
        <Layout className={classes.wrapper}>
            <Sider
                trigger={null}
                collapsible
                collapsed={sidebarCollapsed}
                collapsedWidth={window.innerWidth < 400 ? 0 : 80}
            >
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <div key="siderLogo">
                        <Link to="">
                            LOGO
                        </Link>
                    </div>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        nav 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        nav 2
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        nav 3
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className={classes.header}>
                    {React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        // className: 'trigger',
                        className: classes.toggleBtn,
                        onClick: () => setSidebarCollapsed(!sidebarCollapsed),
                    })}
                </Header>
                <Content
                    // className={classes.content}
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    )
}

export default Chat;