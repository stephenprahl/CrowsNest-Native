import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const planImages = {
    '1': require('../../../assets/images/plan-1.jpg'),
    '2': require('../../../assets/images/plan-2.jpg'),
}; export default function FloorPlanScreen() {
    const { id, name, image } = useLocalSearchParams<{ id: string; name: string; image: string }>();
    const router = useRouter();
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [leftDropdownVisible, setLeftDropdownVisible] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Navbar */}
            <View style={styles.navbar}>
                {searchOpen ? (
                    <>
                        <TouchableOpacity onPress={() => { setSearchOpen(false); setQuery(''); }} style={styles.navBtn}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TextInput
                            autoFocus
                            placeholder="Search floor plan"
                            placeholderTextColor="#7a7f83"
                            value={query}
                            onChangeText={setQuery}
                            style={styles.searchInput}
                        />
                        <View style={styles.navIcons}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => { setSearchOpen(false); setQuery(''); }}>
                                <MaterialCommunityIcons name="close" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
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
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchOpen(true)}>
                                <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuModalVisible(true)}>
                                <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {/* Floor Plan Image */}
            <ScrollView style={styles.content} contentContainerStyle={styles.imageContainer}>
                <Image
                    source={planImages[id as keyof typeof planImages]}
                    style={styles.floorPlanImage}
                    contentFit="contain"
                />
            </ScrollView>

            {/* Bottom Dropdowns */}
            <View style={styles.bottomContainer}>
                <View style={[styles.dropdownContainer, leftDropdownVisible && styles.dropdownContainerOpen]}>
                    {!leftDropdownVisible && (
                        <TouchableOpacity style={[styles.leftDropdown, styles.leftDropdownClosed]} onPress={() => setLeftDropdownVisible(!leftDropdownVisible)}>
                            <Text style={[styles.dropdownText, {fontSize: 13}]}>12-07-2023</Text>
                            <Text style={[styles.dropdownText, {marginHorizontal: 2, fontSize: 18, color: '#666'}]}>│</Text>
                            <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                    {leftDropdownVisible && (
                        <View style={styles.dropdownItems}>
                            <TouchableOpacity style={[styles.dropdownItem, styles.selectedItem]}>
                                <Text style={styles.dropdownItemText}>12-07-2023</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.dropdownItem, styles.dropdownItemRow, styles.compareItem]}>
                                <Text style={[styles.dropdownItemText, {marginRight: 8}]}>Compare</Text>
                                <MaterialCommunityIcons name="compare" size={20} color="#666" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setLeftDropdownVisible(false)}>
                                <Text style={[styles.dropdownText, {fontSize: 13}]}>12-07-2023</Text>
                                <Text style={[styles.dropdownText, {marginHorizontal: 2, fontSize: 18, color: '#666'}]}>│</Text>
                                <MaterialCommunityIcons name="chevron-up" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={styles.rightBar}>
                    {rightCollapsed && (
                        <TouchableOpacity style={[styles.iconButton, styles.iconButtonTransparent]} onPress={() => setRightCollapsed(false)}>
                            <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                    {!rightCollapsed && (
                        <View style={styles.rightDropdownMenu}>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="link" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="square" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="toolbox" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="format-font-size-increase" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="ruler" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <View style={styles.colorCircleIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="compass" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="undo" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <MaterialCommunityIcons name="delete" size={24} color="#8B0000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setRightCollapsed(true)}>
                                <MaterialCommunityIcons name="chevron-up" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

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
                        </View>
                        <View style={styles.filtersList}>
                            <TouchableOpacity style={styles.filterItem}>
                                <Text style={styles.filterText}>All</Text>
                                <MaterialCommunityIcons name="check" size={20} color="#8B0000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <Text style={styles.filterText}>Tasks</Text>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <Text style={styles.filterText}>Plan links</Text>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <Text style={styles.filterText}>Photos</Text>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterItem}>
                                <Text style={styles.filterText}>Attachments</Text>
                                <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#9aa0a6" />
                            </TouchableOpacity>
                            <View style={[styles.filterItem, styles.lastFilterItem, styles.markupColorsItem]}>
                                <Text style={styles.filterText}>Markup colors</Text>
                                <View style={styles.colorCircles}>
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#8B0000' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#006400' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#00008B' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#8B8000' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#8B008B' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#008B8B' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#FF4500' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#8B4513' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#696969' }]} />
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: '#2F4F4F' }]} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Menu Modal */}
            <Modal
                visible={menuModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setMenuModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setMenuModalVisible(false)}
                    />
                    <View style={styles.menuModalContent}>
                        <View style={styles.menuItemsRow}>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialCommunityIcons name="link" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialCommunityIcons name="file-pdf-box" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialCommunityIcons name="crop" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <MaterialCommunityIcons name="qrcode" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.labelsRow}>
                            <Text style={styles.labelText}>Share link</Text>
                            <Text style={styles.labelText}>Export PDF</Text>
                            <Text style={styles.labelText}>Share crop plan</Text>
                            <Text style={styles.labelText}>QR code</Text>
                        </View>
                        <View style={styles.menuBorder} />
                        <View style={styles.menuBottomContainer}>
                            <View style={styles.menuColumn}>
                                <TouchableOpacity style={styles.menuColumnItem}>
                                    <Text style={styles.menuColumnItemText}>Plan details</Text>
                                    <MaterialCommunityIcons name="information" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuColumnItem}>
                                    <Text style={styles.menuColumnItemText}>Tasklist</Text>
                                    <MaterialCommunityIcons name="format-list-checks" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.menuColumnItem, styles.lastMenuColumnItem]}>
                                    <Text style={styles.deleteItemText}>Delete plan</Text>
                                    <MaterialCommunityIcons name="delete" size={24} color="#8B0000" />
                                </TouchableOpacity>
                            </View>
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
    searchInput: {
        flex: 1,
        color: '#fff',
        paddingVertical: 0,
        fontSize: 16,
        lineHeight: 22,
        height: 22,
        textAlignVertical: 'center',
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floorPlanImage: {
        width: SCREEN_WIDTH,
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
        paddingBottom: 4,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    modalTitle: {
        color: '#8B0000',
        fontSize: 18,
        fontWeight: '700',
    },
    filtersList: {
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 16,
    },
    filterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },
    filterText: {
        color: '#ffffff',
        fontSize: 16,
    },
    markupColorsItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    colorCircles: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    colorCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    lastFilterItem: {
        borderBottomWidth: 0,
    },
    menuModalContent: {
        backgroundColor: '#121417',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
    },
    menuItemsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    menuItem: {
        width: 50,
        height: 50,
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    menuBorder: {
        height: 1,
        backgroundColor: '#1f1f1f',
        marginVertical: 16,
    },
    menuColumn: {
        width: '100%',
    },
    menuColumnItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    menuColumnItemText: {
        color: '#fff',
        fontSize: 16,
    },
    bottomContainer: {
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        overflow: 'hidden',
    },
    lastMenuColumnItem: {
        borderBottomWidth: 0,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 8,
    },
    labelText: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
        width: 70,
    },
    deleteItemText: {
        color: '#8B0000',
        fontSize: 16,
    },
    menuBottomContainer: {
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        overflow: 'hidden',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    leftSection: {
        position: 'relative',
    },
    dropdownContainer: {
        position: 'relative',
        borderRadius: 8,
    },
    dropdownContainerOpen: {
        backgroundColor: 'rgba(18, 20, 23, 0.95)',
    },
    dropdownItems: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    leftDropdown: {
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftDropdownClosed: {
        backgroundColor: 'transparent',
    },
    dropdownText: {
        color: '#fff',
        fontSize: 16,
        marginRight: 8,
    },
    leftDropdownMenu: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        backgroundColor: 'rgba(18, 20, 23, 0.95)',
        borderRadius: 8,
        padding: 8,
        minWidth: 150,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    dropdownItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: 'rgba(139, 0, 0, 0.3)',
        marginHorizontal: -8,
        marginTop: -8,
        paddingHorizontal: 8,
        paddingTop: 8,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    compareItem: {
        paddingLeft: 0,
    },
    dropdownItemText: {
        color: '#fff',
        fontSize: 13,
    },
    rightBar: {
        flexDirection: 'column',
        gap: 8,
    },
    iconButton: {
        height: 32,
        backgroundColor: 'transparent',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    iconButtonTransparent: {
        backgroundColor: 'transparent',
    },
    rightDropdownMenu: {
        backgroundColor: 'rgba(18, 20, 23, 0.8)',
        borderRadius: 8,
        padding: 0,
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
    },
    colorCircleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#8B0000',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
});