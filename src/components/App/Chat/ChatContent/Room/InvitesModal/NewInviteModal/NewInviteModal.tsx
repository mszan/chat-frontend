import React, {useState} from 'react';
import {Button, Form, Input, message, Modal, Switch} from 'antd';
import axiosBackend from '../../../../../../../services/axios-backend';
import {TInviteKey} from '../InvitesModal';

interface Props {
    roomId: number,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    modalVisible: boolean
    setInvitesModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setInviteKeys: React.Dispatch<React.SetStateAction<Array<TInviteKey>>>,
    inviteKeys: Array<TInviteKey>
}

const NewInviteModal: React.FC<Props> = ({
                                      roomId: roomId,
                                      setModalVisible: setModalVisible,
                                      modalVisible: modalVisible,
                                      setInvitesModalVisible: setInvitesModalVisible,
                                      setInviteKeys: setInviteKeys,
                                      inviteKeys: inviteKeys
                                  }) => {
    /**
     * Goes back to previous parent modal.
     */
    const handleBack = () => {
        setModalVisible(false);
        setInvitesModalVisible(true);
    };

    /**
     * Handles closing modal.
     */
    const handleClose = () => {
        setModalVisible(false);
    };

    // Submit button loading state. If true, it prevents multiple clicks at once.
    const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false);

    /**
     * Makes a request to backend and creates a new invite key.
     */
    const createInviteKey = (values: any) => {
        console.log(values)
        setSubmitButtonLoading(true);
        axiosBackend.post('/room-invite-keys/', {
            room: roomId,
            only_for_this_user: values.onlyForThisUser?.length > 0 ? values.onlyForThisUser : null,
            give_admin: values.giveAdmin === true,
        })
            .then(r => {
                console.log(r.data);
                message.success({content: <span>Key ID <strong>{r.data.id}</strong> created.</span>});
                const newInviteKey: TInviteKey = {
                    id: r.data.id,
                    key: r.data.key,
                    creator:r.data.creator,
                    room: r.data.room,
                    only_for_this_user: r.data.only_for_this_user,
                    valid_due: r.data.valid_due,
                    give_admin: r.data.give_admin
                }
                setInviteKeys([...inviteKeys, newInviteKey]);
                handleBack();
            })
            .catch(e => {
                message.error({content: <span>Key ID <strong>NOT</strong> created.</span>});
                console.log(e);
            })
            .then(() => {
                setTimeout(() => setSubmitButtonLoading(false), 2000);
            })
    }

    return (
        <Modal
            title="Create new invite"
            visible={modalVisible}
            onCancel={handleClose}
            footer={[
                <Button key="close" onClick={handleBack}>
                    Back
                </Button>,
                <Button
                    key="createKey"
                    type="primary"
                    loading={submitButtonLoading}
                    form="newKeyForm"
                    htmlType="submit"
                >
                    Submit
                </Button>,
            ]}
        >
            <Form
                id="newKeyForm"
                name="newKeyForm"
                layout="vertical"
                onFinish={createInviteKey}
            >
                <Form.Item
                    label="Valid only for specific username"
                    name="onlyForThisUser"
                    tooltip="If username is given, the invite key is valid only for specified username. Otherwise, the invite key is valid to anyone."
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Gives administrative privileges"
                    name="giveAdmin"
                    tooltip="If checked, the invite key will give administrative privileges. Otherwise, the invite key does not give such privileges."
                    style={{marginBottom: 0}}
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default NewInviteModal;