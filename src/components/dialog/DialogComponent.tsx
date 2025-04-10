import React from 'react';
import {Portal, Dialog, Button, Paragraph} from 'react-native-paper';
import Colors from '../../colors/Color';

interface DialogComponentProps {
  visible: boolean;
  title: string;
  content: string;
  onDismiss: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  visible,
  title,
  content,
  onDismiss,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{backgroundColor: Colors.background.paper ,
          borderRadius: 10,}}>
        <Dialog.Title style={{color: Colors.text.primary}}>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{color: Colors.text.secondary}}>{content}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={onDismiss}
            textColor={Colors.text.primary}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              onPress={onConfirm}
              textColor={Colors.primary}>
              {confirmText}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogComponent;
