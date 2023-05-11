import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import COLORS from '../styles/colors';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0, .3)'
  },
  contentContainer: {
    height: 'auto',
    padding: 20,
    justifyContent: 'flex-start'
  },
  cancelBtn: {
    marginTop: 10,
    borderRadius: 10
  },
  modalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 57,
    alignSelf: 'stretch',
    borderRadius: 0,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0
  },
  btnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007aff'
  }
});

class BottomActionSheet extends Component {
  render() {
    const { modalVisible, toggleModal, children } = this.props;
    return (
      <SafeAreaView>
        <Modal
          animationType="fade"
          transparent
          presentationStyle="overFullScreen"
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View>{children}</View>
                <Touchable style={[styles.modalBtn, styles.cancelBtn]} onPress={toggleModal}>
                  <Text style={styles.btnText}>Cancel</Text>
                </Touchable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    );
  }
}

export default BottomActionSheet;
