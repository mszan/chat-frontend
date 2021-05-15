import React, {useEffect, useState} from 'react';
import {Button, Divider, List, message, Modal, Tag, Tooltip} from 'antd';
import axiosBackend from '../../../../../../services/axios-backend';
import NewInviteModal from './NewInviteModal/NewInviteModal';
import {CopyOutlined, LinkOutlined, FieldTimeOutlined} from '@ant-design/icons';
import classes from './InvitesModal.module.scss';

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

const InvitesModal: React.FC<Props> = ({roomId, setModalVisible, modalVisible}) => {
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
        axiosBackend.get(`/rooms-invite-keys?room_id=${roomId}`)
            .then(r => {
                setInviteKeys(r.data.results);
            })
            .catch(e => console.log(e));
    }

    /**
     * Deletes invite key from database and updates 'inviteKeys'.
     */
    const deleteInviteKey = (keyId: number) => {
        axiosBackend.delete(`/rooms-invite-keys/${keyId}`)
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

    /**
     * Sets clipboard value so that user can paste it anywhere aftewards.
     * @param value string that will be set in clipboard
     */
    const setClipboard = async (value: string) => {
        await navigator.clipboard.writeText(value);
    }

    /**
     * Checks if invite key is up to date (is not expired).
     * @param key invite key object
     * @returns boolean
     */
    const isInviteKeyUpToDate = (key: TInviteKey) : boolean => {
        const now = new Date();
        const key_valid_due = new Date(key.valid_due)
        return now < key_valid_due;
    }

    useEffect(() => {
        fetchInviteKeys();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>

            <Modal
                title="InvitesModal"
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

                        // Add expiration icon if key is close to expire.
                        if (!isInviteKeyUpToDate(item)) {
                            tags.unshift(
                                <Tooltip title="Key has expired">
                                    <FieldTimeOutlined className={classes.expiredClockIcon} />
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
                                className={classes.listItem}
                                actions={[
                                    <Tooltip title="Delete this key">
                                        <Button
                                            type="link"
                                            className={classes.deleteBtn}
                                            onClick={() => deleteInviteKey(item.id)}
                                        >
                                            delete
                                        </Button>
                                    </Tooltip>
                                ]}
                            >
                            <span>
                            <Tooltip title="Copy invite key to clipboard">
                                <CopyOutlined
                                    className={classes.copyBtn}
                                    onClick={() => {
                                        setClipboard(item.key)
                                            .then(() => {
                                                message.success('Invite key copied to clipboard.')
                                            })
                                    }}
                                />
                            </Tooltip>
                                <Tooltip title="Copy invite URL to clipboard">
                                    <LinkOutlined
                                        className={classes.copyBtn}
                                        onClick={() => {
                                            setClipboard(`${window.location.protocol}//${window.location.host}/chat/rooms/join?key=${item.key}`)
                                                .then(() => {
                                                    message.success('Invite URL copied to clipboard.')
                                                })
                                        }}
                                    />
                                </Tooltip>
                                {item.id}{tags.length > 0 ? (<Divider type="vertical" />) : null}{tags}
                            </span>
                            </List.Item>
                        )
                    }}
                />
            </Modal>
            <NewInviteModal
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

export default InvitesModal;