import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Notifications</Text>
                {/* Add your notifications list or content here */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1112',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});