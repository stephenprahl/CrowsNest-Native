import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function profile() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Doe')
  const [jobTitle, setJobTitle] = useState('N/A')
  const [company, setCompany] = useState('WickedUI')
  const [phoneNumber, setPhoneNumber] = useState('+1 555-555-5555')
  const [email, setEmail] = useState('john@example.com')
  const [plan, setPlan] = useState('Premium')
  const [smartSync, setSmartSync] = useState(false)
  const [magnifyingGlass, setMagnifyingGlass] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState('')
  const [themeMode, setThemeMode] = useState('Off')
  const [emailNotifications, setEmailNotifications] = useState('Instantly')
  const [tempValue, setTempValue] = useState('')

  const handleModalOption = (option: string) => {
    if (modalType === 'theme') {
      setThemeMode(option)
    } else if (modalType === 'email') {
      setEmailNotifications(option)
    }
    setModalVisible(false)
  }

  const handleSave = () => {
    if (modalType === 'firstName') setFirstName(tempValue)
    else if (modalType === 'lastName') setLastName(tempValue)
    else if (modalType === 'jobTitle') setJobTitle(tempValue)
    else if (modalType === 'company') setCompany(tempValue)
    else if (modalType === 'phoneNumber') setPhoneNumber(tempValue)
    setModalVisible(false)
  }

  const getModalTitle = () => {
    if (modalType === 'theme') return 'Choose Theme'
    if (modalType === 'email') return 'Choose Email Notifications'
    if (modalType === 'firstName') return 'Edit First Name'
    if (modalType === 'lastName') return 'Edit Last Name'
    if (modalType === 'jobTitle') return 'Edit Job Title'
    if (modalType === 'company') return 'Edit Company'
    if (modalType === 'phoneNumber') return 'Edit Phone Number'
    return ''
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.profileTitle}>PROFILE</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>First Name</Text>
            <TouchableOpacity onPress={() => { setModalType('firstName'); setTempValue(firstName); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{firstName}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Last Name</Text>
            <TouchableOpacity onPress={() => { setModalType('lastName'); setTempValue(lastName); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{lastName}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Job Title</Text>
            <TouchableOpacity onPress={() => { setModalType('jobTitle'); setTempValue(jobTitle); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{jobTitle}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Company</Text>
            <TouchableOpacity onPress={() => { setModalType('company'); setTempValue(company); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{company}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Phone Number</Text>
            <TouchableOpacity onPress={() => { setModalType('phoneNumber'); setTempValue(phoneNumber); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{phoneNumber}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              placeholder="Email"
              placeholderTextColor="#9aa0a6"
            />
            <Text style={styles.label}>Plan</Text>
            <TextInput
              style={styles.input}
              value={plan}
              editable={false}
              placeholder="Plan"
              placeholderTextColor="#9aa0a6"
            />
          </View>
        </View>
        <Text style={styles.profileTitle}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Email Notifications</Text>
            <TouchableOpacity onPress={() => { setModalType('email'); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{emailNotifications}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkbox} onPress={() => setSmartSync(!smartSync)}>
              <Text style={styles.checkboxText}>Smart Synchronization</Text>
              <Ionicons name={smartSync ? "checkbox" : "checkbox-outline"} size={20} color={smartSync ? "#8B0000" : "#ffffff"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkbox} onPress={() => setMagnifyingGlass(!magnifyingGlass)}>
              <Text style={styles.checkboxText}>Magnifying glass for markups</Text>
              <Ionicons name={magnifyingGlass ? "checkbox" : "checkbox-outline"} size={20} color={magnifyingGlass ? "#8B0000" : "#ffffff"} />
            </TouchableOpacity>
            <Text style={styles.label}>Theme</Text>
            <TouchableOpacity onPress={() => { setModalType('theme'); setModalVisible(true); }} style={styles.input}>
              <Text style={styles.inputText}>{themeMode}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            {modalType === 'theme' ? (
              <>
                <TouchableOpacity onPress={() => handleModalOption('On')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>On</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModalOption('Off')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Off</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModalOption('Turn on at Sunset')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Turn on at Sunset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModalOption('Use system setting')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Use system setting</Text>
                </TouchableOpacity>
              </>
            ) : modalType === 'email' ? (
              <>
                <TouchableOpacity onPress={() => handleModalOption('Never')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Never</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModalOption('Daily')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModalOption('Instantly')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Instantly</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.modalInput}
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder="Enter value"
                  placeholderTextColor="#9aa0a6"
                />
                <TouchableOpacity onPress={handleSave} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            )}
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
    cursor: 'pointer',
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