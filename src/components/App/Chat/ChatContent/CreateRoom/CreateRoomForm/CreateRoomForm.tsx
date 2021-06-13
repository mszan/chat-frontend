import {Button, Form, Input, message} from 'antd';
import React, {useState} from 'react';
import axiosBackend from '../../../../../../services/axios-backend';
import {useHistory} from 'react-router-dom';
import {IRoomOnSider} from '../../../Chat';
import {TRoom} from '../../Room/Room';

type Props = {
    roomList: IRoomOnSider[]
    setRoomList: React.Dispatch<React.SetStateAction<IRoomOnSider[]>>
}

const CreateRoomForm: React.FC<Props> = ({roomList, setRoomList}) => {
    const history = useHistory();

    // Login button loading state.
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const onFinish = (values: {name: string}) => {
        setButtonLoading(true);

        axiosBackend.post('/rooms/', {
            name: values.name,
            active: true,
            admins: [localStorage.getItem('loggedUserUsername')],
            users: [localStorage.getItem('loggedUserUsername')]
        })
            .then(r => {
                message.success({content: <span>Room <strong>{null}</strong> created.</span>});
                history.push(`/chat/rooms/${r.data.id}`); // Redirect to created room app.
                const newRoom: TRoom = {
                    id: r.data.id,
                    url: r.data.url,
                    name: r.data.name,
                    active: r.data.active,
                    creator: r.data.creator,
                    admins: r.data.admins,
                    users: r.data.users,
                };
                setRoomList([...roomList, newRoom]);
            })
            .catch(e => {
                console.log(e);
                setTimeout(() => setButtonLoading(false), 1000);
            });
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