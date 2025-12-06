import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
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
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.navTitle} numberOfLines={1}>
                    {name || 'Floor Plan'}
                </Text>
                <View style={styles.navIcons}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setFiltersModalVisible(true)}>
                        <MaterialCommunityIcons name="eye" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Floor Plan Image */}
            <ScrollView style={styles.content} contentContainerStyle={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.floorPlanImage}
                    resizeMode="contain"
                />
            </ScrollView>

            {/* Filters Modal */}
            <Modal
                visible={filtersModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFiltersModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setFiltersModalVisible(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setFiltersModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#9aa0a6" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filtersList}>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="check" size={20} color="#8B0000" />
                                <Text style={styles.filterText}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                                <Text style={styles.filterText}>Tasks</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                                <Text style={styles.filterText}>Plan links</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                                <Text style={styles.filterText}>Photos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                                <Text style={styles.filterText}>Attachments</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                                <Text style={styles.filterText}>Markup colors</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1112',
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#121417',
        borderBottomWidth: 1,
        borderBottomColor: '#151515',
    },
    navBtn: {
        padding: 4,
    },
    navTitle: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 12,
    },
    navIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 12,
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackdrop: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#121417',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    filtersList: {
        padding: 16,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    filterText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 12,
    },
});