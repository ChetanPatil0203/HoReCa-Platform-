import React from 'react';
import SubmitSupportTicketModal from '../../common/SubmitSupportTicketModal';

export default function CreateTicketModal({ visible, onClose, onSave }) {
  return (
    <SubmitSupportTicketModal
      visible={visible}
      onClose={onClose}
      onSubmitSuccess={(data) => {
        onSave && onSave(data);
      }}
    />
  );
}
