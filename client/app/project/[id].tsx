import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
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
    image: string;
};

const SAMPLE_PLANS: Plan[] = [
    { id: '1', name: 'Floor Plan - Level 1', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop' },
    { id: '2', name: 'Floor Plan - Level 2', image: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=400&h=300&fit=crop' },
    { id: '3', name: 'Electrical Layout', image: 'https://images.unsplash.com/photo-1581094794329-c8112d89af12?w=400&h=300&fit=crop' },
    { id: '4', name: 'Plumbing Layout', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop' },
    { id: '5', name: 'HVAC System', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
];

export default function ProjectHomeScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('plans');
    const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
    const [plans] = useState(SAMPLE_PLANS);
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
                    <View style={styles.plansContainer}>
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
                            <ScrollView style={styles.plansListContainer} contentContainerStyle={styles.plansList}>
                                {plans.map((plan) => (
                                    <TouchableOpacity
                                        key={plan.id}
                                        style={styles.planCard}
                                        activeOpacity={0.8}
                                        onPress={() => router.push(`/project/floor-plan/${plan.id}?name=${plan.name}&image=${plan.image}`)}
                                    >
                                        <View style={styles.planImageContainer}>
                                            <Image source={{ uri: plan.image }} style={styles.planImage} resizeMode="cover" />
                                        </View>
                                        <View style={styles.planCardOverlay}>
                                            <Text style={styles.planCardId}>ID: {plan.id}</Text>
                                            <Text style={styles.planCardTitle}>{plan.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.plansContent}>
                                <MaterialCommunityIcons name="floor-plan" size={60} color="#8B0000" />
                                <Text style={styles.contentTitle}>Plans</Text>
                                <Text style={styles.contentSubtitle}>Select a plan to view</Text>
                            </View>
                        )}
                    </View>
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
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
                    </TouchableOpacity>
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
    plansDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#0f1112',
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
    planCard: {
        backgroundColor: '#161717',
        borderRadius: 6,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1f1f1f',
        width: '75%',
    },
    planImageContainer: {
        padding: 8,
        paddingBottom: 0,
        backgroundColor: '#161717',
    },
    planImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#1f1f1f',
        borderRadius: 4,
    },
    planCardOverlay: {
        padding: 12,
        backgroundColor: '#161717',
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
});
