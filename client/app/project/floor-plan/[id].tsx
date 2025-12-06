import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FloorPlanScreen() {
    const { id, name, image } = useLocalSearchParams<{ id: string; name: string; image: string }>();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {name || 'Floor Plan'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Floor Plan Image */}
            <ScrollView style={styles.content} contentContainerStyle={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.floorPlanImage}
                    resizeMode="contain"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1112',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#121417',
        borderBottomWidth: 1,
        borderBottomColor: '#151515',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 12,
    },
    headerRight: {
        width: 32, // To balance the back button
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    floorPlanImage: {
        width: SCREEN_WIDTH - 32,
        height: SCREEN_HEIGHT - 200, // Adjust based on header height
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
    },
});