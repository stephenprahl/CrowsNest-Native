import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

type MenuItem = {
    id: string;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const MENU_ITEMS: MenuItem[] = [
    { id: 'plans', label: 'Plans', icon: 'floor-plan' },
    { id: 'specifications', label: 'Specifications', icon: 'file-document-outline' },
    { id: 'tasks', label: 'Tasks', icon: 'checkbox-marked-circle-outline' },
    { id: 'photos', label: 'Photos', icon: 'image-multiple-outline' },
    { id: 'forms', label: 'Forms', icon: 'form-select' },
    { id: 'files', label: 'Files', icon: 'folder-outline' },
    { id: 'people', label: 'People', icon: 'account-group-outline' },
    { id: 'settings', label: 'Settings', icon: 'cog-outline' },
];

type Plan = {
    id: string;
    name: string;
    image: any;
};

const SAMPLE_PLANS: Plan[] = [
    { id: '1', name: 'Floor Plan - Level 1', image: require('../../assets/images/plan-1.jpg') },
    { id: '2', name: 'Floor Plan - Level 2', image: require('../../assets/images/plan-2.jpg') },
];

const RECENTLY_VIEWED_PLANS: Plan[] = [
    { id: '1', name: 'Floor Plan - Level 1', image: require('../../assets/images/plan-1.jpg') },
    { id: '2', name: 'Floor Plan - Level 2', image: require('../../assets/images/plan-2.jpg') },
];

export default function ProjectHomeScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('plans');
    const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
    const [plans] = useState(SAMPLE_PLANS);
    const [viewMode, setViewMode] = useState<'thumbnail' | 'list'>('thumbnail');
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    const openSidebar = () => {
        setSidebarOpen(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: -SIDEBAR_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setSidebarOpen(false));
    };

    const handleMenuItemPress = (itemId: string) => {
        setActiveSection(itemId);
        closeSidebar();
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'plans':
                return (
                    <ScrollView style={styles.plansListContainer} contentContainerStyle={styles.plansContentContainer}>
                        <View style={styles.plansWrapper}>
                            <TouchableOpacity
                                style={styles.plansDropdown}
                                onPress={() => setPlansDropdownOpen(!plansDropdownOpen)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.plansDropdownLeft}>
                                    <MaterialCommunityIcons name="folder-outline" size={20} color="#9aa0a6" />
                                    <Text style={styles.plansDropdownText}>All Plans</Text>
                                </View>
                                <View style={styles.plansDropdownRight}>
                                    <Text style={styles.plansCount}>({plans.length} plans)</Text>
                                    <MaterialCommunityIcons
                                        name={plansDropdownOpen ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color="#9aa0a6"
                                        style={styles.plansDropdownChevron}
                                    />
                                </View>
                            </TouchableOpacity>
                            {plansDropdownOpen ? (
                                <View style={styles.plansGrid}>
                                    {plans.map((plan) => (
                                        viewMode === 'thumbnail' ? (
                                            <TouchableOpacity
                                                key={plan.id}
                                                style={styles.planCard}
                                                activeOpacity={0.8}
                                                onPress={() => router.push(`/project/floor-plan/${plan.id}?name=${plan.name}`)}
                                            >
                                                <View style={styles.planImageContainer}>
                                                    <Image source={plan.image} style={styles.planImage} contentFit="cover" />
                                                </View>
                                                <View style={styles.planCardOverlay}>
                                                    <Text style={styles.planCardId}>ID: {plan.id}</Text>
                                                    <Text style={styles.planCardTitle}>{plan.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                key={plan.id}
                                                style={styles.planListItem}
                                                activeOpacity={0.8}
                                                onPress={() => router.push(`/project/floor-plan/${plan.id}?name=${plan.name}`)}
                                            >
                                                <MaterialCommunityIcons name="floor-plan" size={24} color="#9aa0a6" />
                                                <Text style={styles.planListText} numberOfLines={1}>{plan.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.plansContent}>
                                    <MaterialCommunityIcons name="floor-plan" size={60} color="#8B0000" />
                                    <Text style={styles.contentTitle}>Plans</Text>
                                    <Text style={styles.contentSubtitle}>Select a plan to view</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                );
            case 'specifications':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="file-document-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Specifications</Text>
                        <Text style={styles.contentSubtitle}>Project specifications</Text>
                    </View>
                );
            case 'tasks':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Tasks</Text>
                        <Text style={styles.contentSubtitle}>Manage project tasks</Text>
                    </View>
                );
            case 'photos':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="image-multiple-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Photos</Text>
                        <Text style={styles.contentSubtitle}>Project photo gallery</Text>
                    </View>
                );
            case 'forms':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="form-select" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Forms</Text>
                        <Text style={styles.contentSubtitle}>Project forms and checklists</Text>
                    </View>
                );
            case 'files':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="folder-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Files</Text>
                        <Text style={styles.contentSubtitle}>Project files and documents</Text>
                    </View>
                );
            case 'people':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="account-group-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>People</Text>
                        <Text style={styles.contentSubtitle}>Project team members</Text>
                    </View>
                );
            case 'settings':
                return (
                    <View style={styles.contentSection}>
                        <MaterialCommunityIcons name="cog-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Settings</Text>
                        <Text style={styles.contentSubtitle}>Project configuration</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with hamburger menu */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openSidebar} style={styles.menuBtn}>
                    <MaterialCommunityIcons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {name || 'Project'}
                </Text>
                <View style={styles.headerRight}>
                    {activeSection === 'plans' ? (
                        <>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setPlansDropdownOpen(!plansDropdownOpen)}>
                                <MaterialCommunityIcons name={plansDropdownOpen ? "fullscreen-exit" : "fullscreen"} size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setViewMode(viewMode === 'thumbnail' ? 'list' : 'thumbnail')}>
                                <MaterialCommunityIcons name={viewMode === 'thumbnail' ? "view-list" : "view-grid"} size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setHistoryModalOpen(true)}>
                                <MaterialCommunityIcons name="history" size={22} color="#fff" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.iconBtn}>
                                <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Main content area */}
            <View style={styles.content}>
                {renderContent()}
            </View>

            {/* Sidebar overlay */}
            {sidebarOpen && (
                <Pressable style={styles.overlay} onPress={closeSidebar}>
                    <Animated.View
                        style={[
                            styles.sidebar,
                            { transform: [{ translateX: slideAnim }] },
                        ]}
                    >
                        <Pressable style={styles.sidebarContent} onPress={(e) => e.stopPropagation()}>
                            {/* Sidebar header */}
                            <View style={styles.sidebarHeader}>
                                <View style={styles.sidebarHeaderText}>
                                    <Text style={styles.sidebarTitle} numberOfLines={1}>
                                        {name || 'Project'}
                                    </Text>
                                    <Text style={styles.sidebarSubtitle}>Project Menu</Text>
                                </View>
                            </View>

                            {/* Menu items */}
                            <View style={styles.menuList}>
                                {MENU_ITEMS.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.menuItem,
                                            activeSection === item.id && styles.menuItemActive,
                                        ]}
                                        onPress={() => handleMenuItemPress(item.id)}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.icon}
                                            size={22}
                                            color={activeSection === item.id ? '#8B0000' : '#9aa0a6'}
                                        />
                                        <Text
                                            style={[
                                                styles.menuItemText,
                                                activeSection === item.id && styles.menuItemTextActive,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Back to projects */}
                            <View style={styles.sidebarFooter}>
                                <TouchableOpacity
                                    style={styles.backToProjects}
                                    onPress={() => router.back()}
                                >
                                    <MaterialCommunityIcons name="home-outline" size={20} color="#9aa0a6" />
                                    <Text style={styles.backToProjectsText}>Back to Projects</Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Animated.View>
                </Pressable>
            )}

            {/* History Modal */}
            <Modal
                visible={historyModalOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setHistoryModalOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setHistoryModalOpen(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Recently Viewed Plans</Text>
                            <TouchableOpacity onPress={() => setHistoryModalOpen(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            {RECENTLY_VIEWED_PLANS.map((plan) => (
                                <TouchableOpacity key={plan.id} style={styles.recentPlanItem}>
                                    <Image source={plan.image} style={styles.recentPlanImage} />
                                    <Text style={styles.recentPlanName}>{plan.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
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
    menuBtn: {
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 12,
    },
    content: {
        flex: 1,
    },
    contentSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    plansContainer: {
        flex: 1,
    },
    plansWrapper: {
        backgroundColor: '#161717',
        borderWidth: 1,
        borderColor: '#1f1f1f',
        borderRadius: 6,
        width: '100%',
        alignSelf: 'center',
        padding: 12,
    },
    plansDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    plansDropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plansDropdownRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plansDropdownText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 10,
        marginRight: 6,
    },
    plansCount: {
        color: '#9aa0a6',
        fontSize: 14,
        marginRight: 4,
    },
    plansDropdownChevron: {
        marginLeft: 2,
    },
    plansContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    plansListContainer: {
        flex: 1,
    },
    plansList: {
        padding: 12,
        alignItems: 'center',
    },
    plansContentContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    plansGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    planCard: {
        backgroundColor: '#1f1f1f',
        borderRadius: 6,
        marginBottom: 12,
        overflow: 'hidden',
        width: '48%',
    },
    planImageContainer: {
        padding: 8,
        paddingBottom: 0,
        backgroundColor: '#1f1f1f',
    },
    planImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#1f1f1f',
        borderRadius: 4,
    },
    planCardOverlay: {
        padding: 12,
        backgroundColor: '#1f1f1f',
        alignItems: 'center',
    },
    planCardTitle: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    planCardId: {
        color: '#9aa0a6',
        fontSize: 12,
        marginBottom: 4,
        textAlign: 'center',
    },
    planListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        borderRadius: 6,
        marginBottom: 12,
        padding: 12,
        width: '100%',
    },
    planListText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },
    contentTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
    },
    contentSubtitle: {
        color: '#9aa0a6',
        fontSize: 14,
        marginTop: 8,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SIDEBAR_WIDTH,
        height: '100%',
        backgroundColor: '#121417',
        borderRightWidth: 1,
        borderRightColor: '#1f1f1f',
        zIndex: 101,
    },
    sidebarContent: {
        flex: 1,
        height: '100%',
    },
    sidebarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
        backgroundColor: '#0f1112',
    },
    sidebarHeaderText: {
        flex: 1,
    },
    sidebarTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    sidebarSubtitle: {
        color: '#9aa0a6',
        fontSize: 12,
        marginTop: 2,
    },
    menuList: {
        flex: 1,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    menuItemActive: {
        backgroundColor: 'rgba(139, 0, 0, 0.15)',
        borderLeftWidth: 3,
        borderLeftColor: '#8B0000',
    },
    menuItemText: {
        color: '#9aa0a6',
        fontSize: 15,
        marginLeft: 16,
    },
    menuItemTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
    sidebarFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#1f1f1f',
    },
    backToProjects: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    backToProjectsText: {
        color: '#9aa0a6',
        fontSize: 14,
        marginLeft: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#121417',
        borderRadius: 8,
        width: '90%',
        maxHeight: '80%',
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
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 16,
    },
    recentPlanItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },
    recentPlanImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 12,
    },
    recentPlanName: {
        color: '#ffffff',
        fontSize: 16,
    },
});
