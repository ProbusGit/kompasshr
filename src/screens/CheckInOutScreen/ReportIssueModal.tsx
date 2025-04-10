import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import Colors from '../../colors/Color';

interface ReportIssueModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (remark: string) => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  visible,
  onDismiss,
  onSubmit,
}) => {
  
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  const handleRemarkChange = (value: string) => {
    setRemark(value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (remark.trim()) {
      onSubmit(remark);
      setRemark('');
      onDismiss();
    } else {
      setError('Remark cannot be empty.');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Add Remark</Text>
        <TextInput
          value={remark}
          onChangeText={handleRemarkChange}
          placeholder="Enter your remark here"
          placeholderTextColor={Colors.text.placeholderText}
          multiline
          numberOfLines={10}
          style={[
            styles.input,
            error ? styles.inputError : null,
            { textDecorationLine: 'none' },
          ]}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <Button mode="text" onPress={onDismiss} style={styles.button} labelStyle={{ color: Colors.black }}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, { backgroundColor: Colors.lightGrey }]}>
            Submit
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
    color: Colors.black,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    color: Colors.black,
    marginLeft: 10,
  },
});

export default ReportIssueModal;
