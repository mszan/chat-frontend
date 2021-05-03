import React, {useEffect, useState} from 'react';
import {Button, Divider, List, message, Modal, Tag, Tooltip} from 'antd';
import axiosBackend from '../../../../../../services/axios-backend';
import New from './New/New';

export type TInviteKey = {
    id: number,
    key: string,
    creator?: string,
    room?: number,
    only_for_this_user: string,
    valid_due: string,
    give_admin: boolean
}

interface Props {
    roomId: number,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    modalVisible: boolean
}

const Invites: React.FC<Props> = ({roomId: roomId, setModalVisible: setModalVisible, modalVisible: modalVisible}) => {
    const [inviteKeys, setInviteKeys] = useState<Array<TInviteKey>>([] as Array<TInviteKey>);

    // Visibility state for child modal which contains new key creation form.
    const [newKeyModalVisible, setNewKeyModalVisible] = useState<boolean>(false);

    /**
     * Handles closing modal.
     */
    const handleClose = () => {
        setModalVisible(false);
    };

    /**
     * Fetches invite keys and saves them in 'inviteKeys'.
     */
    const fetchInviteKeys = () => {
        axiosBackend.get(`/room-invite-keys?room_id=${roomId}`)
            .then(r => {
                setInviteKeys(r.data.results);
            })
            .catch(e => console.log(e));
    }

    /**
     * Deletes invite key from database and updates 'inviteKeys'.
     */
    const deleteInviteKey = (keyId: number) => {
        axiosBackend.delete(`/room-invite-keys/${keyId}`)
            .then(() => {
                // Create new array without deleted key.
                const newInviteKeys: Array<TInviteKey> = inviteKeys.filter(function( item ) {
                    return item.id !== keyId;
                });
                setInviteKeys(newInviteKeys);
                message.success({content: <span>Key ID <strong>{keyId}</strong> deleted.</span>});
            })
            .catch(e => {
                message.error({content: <span>Key ID <strong>NOT</strong> deleted.</span>});
                console.log(e)
            });
    }

    /**
     * Switches currently opened modals to display one
     * with invite key creation form.
     */
    const openNewKeyInviteModal = () => {
        setModalVisible(false);
        setNewKeyModalVisible(true);
    }

    useEffect(() => {
        fetchInviteKeys();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>

            <Modal
                title="Invites"
                visible={modalVisible}
                onCancel={handleClose}
                footer={[
                    <Button key="close" onClick={handleClose}>
                        Close
                    </Button>,
                    <Button key="create-key" type="primary" onClick={openNewKeyInviteModal}>
                        Create new key
                    </Button>,
                ]}
            >
                <List
                    size="large"
                    bordered
                    dataSource={inviteKeys}
                    renderItem={item => {
                        // Holds tags (badges) to be displayed.
                        let tags: Array<JSX.Element> = [];

                        // Add user tag if invite is for specific user.
                        if (item.only_for_this_user !== null) {
                            tags.unshift(
                                <Tooltip title="Valid only for this user">
                                    <Tag color="blue">{item.only_for_this_user}</Tag>
                                </Tooltip>
                            )
                        }

                        // Add admin tag if invite gives admin privileges.
                        if (item.give_admin) {
                            tags.unshift(
                                <Tooltip title="Gives administrative privileges">
                                    <Tag color="red">admin</Tag>
                                </Tooltip>
                            )
                        }

                        return (
                            <List.Item
                                actions={[
                                    <Tooltip title="Delete this key">
                                        <Button
                                            type="link"
                                            style={{
                                                margin: 0,
                                                padding: 0
                                            }}
                                            onClick={() => deleteInviteKey(item.id)}
                                        >
                                            delete
                                        </Button>
                                    </Tooltip>
                                ]}
                            >
                            <span>
                                {item.id}{tags.length > 0 ? (<Divider type="vertical" />) : null}{tags}
                            </span>
                            </List.Item>
                        )
                    }}
                />
            </Modal>
            <New
                roomId={roomId}
                setModalVisible={setNewKeyModalVisible}
                modalVisible={newKeyModalVisible}
                setInvitesModalVisible={setModalVisible}
                inviteKeys={inviteKeys}
                setInviteKeys={setInviteKeys}
            />
        </React.Fragment>
    )
}

export default Invites;