import { HStack } from '@chakra-ui/react';
import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  content_str: string;
  ok: () => Promise<void>;
  cancel: () => void;
}

const PopupWindow: React.FC<ModalProps> = ({ isOpen, ok, cancel, content_str}) => {
  if (!isOpen) {
    return null;
  }

  const ok_close = () => {
    close();
    ok();
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <p style={{color:'gray'}}>{content_str}</p>
        <HStack>
          <button style={{color:'gray'}} onClick={ok_close}>Yes</button>
          <button style={{color:'gray'}} onClick={cancel}>Cancel</button>
        </HStack>
      </div>
    </div>
  );
};

export default PopupWindow;