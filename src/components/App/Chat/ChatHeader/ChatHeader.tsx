import React from 'react'
import classes from './ChatHeader.module.scss'
import {
  Badge,
  Col,
  Dropdown,
  Layout,
  Menu,
  message,
  Row,
  Typography,
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  DownOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { logout } from '../../../../services/auth'
import { useHistory } from 'react-router-dom'

const { Header } = Layout
const { Text } = Typography

interface Props {
  siderCollapsed: boolean
  setSiderCollapsed: () => void
}

const ChatHeader: React.FC<Props> = ({ siderCollapsed, setSiderCollapsed }) => {
  // Used to redirect user to login page after getting logged out.
  let history = useHistory()

  return (
    <Header className={classes.wrapper}>
      <Row justify="space-between">
        <Col>
          {React.createElement(
            siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: classes.sidebarToggleBtn,
              onClick: () => setSiderCollapsed(),
            },
          )}
        </Col>
        <Col>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="0" icon={<SettingOutlined />}>
                  User settings
                </Menu.Item>

                <Menu.Item key="3" icon={<PoweroffOutlined />}
                  onClick={() => {
                    logout()
                    history.push('')
                    message.success('Bye bye!')
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <a
              className={classes.dropdownLink}
              onClick={(e) => e.preventDefault()}
            >
              {localStorage.getItem('loggedUserUsername')} <DownOutlined />
            </a>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  )
}

export default ChatHeader
