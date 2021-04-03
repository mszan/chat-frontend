import React from 'react';
import classes from './ChatHeader.module.scss';
import {Col, Layout, message, Row, Typography} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined} from '@ant-design/icons';
import {logout} from '../../../../services/auth';
import {useHistory} from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;


interface Props {
    siderCollapsed: boolean;
    setSiderCollapsed: () => void;
}

const ChatHeader: React.FC<Props> = ({siderCollapsed, setSiderCollapsed}) => {
    // Used to redirect user to login page after getting logged out.
    let history = useHistory();

    return (
        <Header className={classes.wrapper}>
            <Row justify="space-between">
                <Col>
                    {React.createElement(siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: classes.sidebarToggleBtn,
                        onClick: () => setSiderCollapsed(),
                    })}
                </Col>
                <Col>
                    <Text className={classes.userText}>filltheusername</Text>
                    <PoweroffOutlined
                        className={classes.logoutBtn}
                        onClick={() => {
                            logout() // Logout user.
                            history.push('')    // Redirect to login page.
                            message.success('Bye bye!')
                        }}
                    />
                </Col>
            </Row>
        </Header>
    )
}

export default ChatHeader;