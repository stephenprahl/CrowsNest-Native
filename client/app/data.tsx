import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DataScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Cache Preferences</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Ionicons name="hardware-chip" size={50} color="#ffffff" />
        <Text style={styles.placeholderText}>Free Disk Space: 5.0 GB</Text>
      </View>
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
    width: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
})