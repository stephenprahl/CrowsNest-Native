import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SupportScreen() {
  const router = useRouter()
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john@example.com')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [attachLogs, setAttachLogs] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleSend = () => {
    // TODO: wire up support API / navigation
    console.log({ name, email, subject, message, priority, attachLogs })
    setSubject('')
    setMessage('')
  }

  const handleSendDiagnostics = () => {
    // placeholder action for sending diagnostics
    console.log('Sending diagnostic information to support...')
    Alert.alert('Diagnostics', 'Diagnostic information sent to support.')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.profileTitle}>TUTORIALS</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity style={styles.input}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.inputText}>Intro Tutorial</Text>
                <Ionicons name="chevron-forward" size={20} color="#b0aeaeff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.input}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.inputText}>Video Tutorial</Text>
                <Ionicons name="chevron-forward" size={20} color="#b0aeaeff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.profileTitle}>CONTACT US</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.inputRow}>
              <Text style={styles.inputText}>Contact Support</Text>
              <Ionicons name="mail" size={20} color="#ff4d4d" />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputText}>Request Demo</Text>
              <Ionicons name="mail" size={20} color="#ff4d4d" />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputText}>Send Diagnostic Information</Text>
            </View>
          </View>
        </View>

        <Text style={styles.profileTitle}>APP DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.inputRow}>
              <Text style={styles.inputText}>Rate this app</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Ionicons name="star" size={18} color="#ff4d4d" />
                <Ionicons name="star" size={18} color="#ff4d4d" />
                <Ionicons name="star" size={18} color="#ff4d4d" />
                <Ionicons name="star" size={18} color="#ff4d4d" />
                <Ionicons name="star-outline" size={18} color="#ff4d4d" />
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputText}>Version</Text>
              <Text style={[styles.inputText, { opacity: 0.8 }]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Priority</Text>
            <TouchableOpacity onPress={() => { setPriority('Low'); setModalVisible(false) }} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Low</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPriority('Medium'); setModalVisible(false) }} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPriority('High'); setModalVisible(false) }} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>High</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#2a2a2a' }]}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1112',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121417',
    borderBottomWidth: 1,
    borderBottomColor: '#151515',
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: '#b0aeaeff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
  },
  placeholder: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  profileTitle: {
    color: '#9aa0a6',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141616',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 0,
    overflow: 'hidden',
    marginVertical: 3
  },
  cardContent: {
    flex: 1,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 2,
  },
  input: {
    color: '#b0aeaeff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingVertical: 6,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#b0aeaeff',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingVertical: 6,
    marginBottom: 6,
  },
  inputText: {
    color: '#b0aeaeff',
    fontSize: 14,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingVertical: 6,
  },
  checkboxText: {
    color: '#ffffff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#141616',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingVertical: 8,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#121417',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
})