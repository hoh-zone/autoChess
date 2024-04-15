import { Button, HStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import useLocale from "../../hooks/useLocale"

interface ModalProps {
  isOpen: boolean;
  content_str: string;
  ok: () => Promise<void>;
  cancel: () => void;
}

const PopupWindow: React.FC<ModalProps> = ({ isOpen, ok, cancel, content_str }) => {
  const getLocale = useLocale()
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
        <p style={{ color: 'gray' }}>{content_str}</p>
        <HStack>
          <Button onClick={ok_close}>{getLocale('Yes')}</Button>
          <Button onClick={cancel}>{getLocale('Cancel')}</Button>
        </HStack>
      </div>
    </div>
  );
};

export default PopupWindow;