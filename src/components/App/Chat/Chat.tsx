import React, {useState} from 'react';
import {Col, Layout, Menu, message, Row, Typography} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PoweroffOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import classes from './Chat.module.scss';
import {Link, useHistory} from 'react-router-dom';
import {logout} from '../../../services/auth';

const { Text } = Typography;

const { Header, Sider, Content } = Layout;

type Props = {}

const Chat: React.FC<Props> = () => {
    // Sidebar collapse state.
    //  True - sidebar collapsed (desktop) / hidden (mobile).
    //  False - visible.
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

    // Used to redirect user to login page after getting logged out.
    let history = useHistory();

    return (
        <Layout className={classes.wrapper}>
            <Sider
                trigger={null}
                collapsible
                collapsed={sidebarCollapsed}
                collapsedWidth={window.innerWidth < 400 ? 0 : 80}
            >
                <div key="siderLogo" className={classes.logo}>
                    <Link to="">
                        LOGO
                    </Link>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
                    <Row justify="space-between">
                        <Col>
                            {React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: classes.sidebarToggleBtn,
                                onClick: () => setSidebarCollapsed(!sidebarCollapsed),
                            })}
                        </Col>
                        <Col>
                            <Text className={classes.headerUserText}>filltheusername</Text>
                            <PoweroffOutlined
                                className={classes.headerUserLogoutIcon}
                                onClick={() => {
                                    logout() // Logout user.
                                    history.push('')    // Redirect to login page.
                                    message.success('Bye bye!')
                                }}
                            />
                        </Col>
                    </Row>
                </Header>
                <Content
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