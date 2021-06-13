import React from 'react';
import {Modal} from 'antd';

interface Props {
    roomId: number,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    modalVisible: boolean
}

const SettingsModal: React.FC<Props> = ({setModalVisible, modalVisible}) => {
    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <Modal title="Settings" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Soon.</p>
        </Modal>
    );
};

export default SettingsModal;
