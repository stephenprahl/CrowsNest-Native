import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

type Person = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
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
    const { name } = useLocalSearchParams<{ id: string; name: string }>();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('plans');
    const [plansDropdownOpen, setPlansDropdownOpen] = useState(false);
    const [plans] = useState(SAMPLE_PLANS);
    const [viewMode, setViewMode] = useState<'thumbnail' | 'list'>('thumbnail');
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const textInputRef = useRef<TextInput>(null);

    const [projectSettings, setProjectSettings] = useState({
        name: name || 'Project Name',
        description: 'Project description',
        status: 'Active',
        location: 'Project location',
        budget: '100000',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        archiveTasksEnabled: false,
        mobileStorageEnabled: false,
        projectName: name || 'Project Name',
        projectCode: 'N/A',
        address: 'Enter project address',
        sendEmailNotifications: false,
        requireCostManpower: false,
    });

    const [sendEmailChecked, setSendEmailChecked] = useState(false);
    const [requireCostChecked, setRequireCostChecked] = useState(false);

    const [lastSync] = useState('Never');

    const [manpowerUnitModalVisible, setManpowerUnitModalVisible] = useState(false);
    const [manpowerUnit, setManpowerUnit] = useState('man-hours');

    const [mobileStorageModalVisible, setMobileStorageModalVisible] = useState(false);
    const [mobileStorageOption, setMobileStorageOption] = useState('Include all revisions');

    const [archiveTasksModalVisible, setArchiveTasksModalVisible] = useState(false);
    const [archiveTasksOption, setArchiveTasksOption] = useState('After 30 days');

    const [measurementUnitModalVisible, setMeasurementUnitModalVisible] = useState(false);
    const [measurementUnit, setMeasurementUnit] = useState('US/Imperial');

    const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
    const [currency, setCurrency] = useState('USD');

    const [timezoneModalVisible, setTimezoneModalVisible] = useState(false);
    const [timezone, setTimezone] = useState('(GMT+00:00) Greenwich Mean Time - London');

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<'projectName' | 'projectCode' | 'address'>('projectName');
    const [editingValue, setEditingValue] = useState('');

    const [people] = useState<Person[]>([]);

    useEffect(() => {
        if (activeSection === 'specifications' && searchOpen) {
            setTimeout(() => {
                textInputRef.current?.focus();
            }, 100);
        }
    }, [searchOpen, activeSection]);

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
                        <Text style={styles.contentTitle}>View all the most up-to-date project specifications on the go</Text>
                        <Text style={styles.contentSubtitleSmall}>To upload specifications, use CrowsNest on the web</Text>
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
                    <View style={styles.peopleContainer}>
                        <ScrollView style={styles.peopleScrollView} contentContainerStyle={styles.peopleContent}>
                            {people.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <MaterialCommunityIcons name="account-group-outline" size={60} color="#8B0000" />
                                    <Text style={styles.contentTitle}>Invite your team</Text>
                                    <Text style={styles.contentSubtitle}>Organize your project team and manage permission levels</Text>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.sectionTitle}>Team Members</Text>
                                    <View style={styles.peopleList}>
                                        {people.map((person) => (
                                            <View key={person.id} style={styles.personItem}>
                                                <MaterialCommunityIcons name="account-circle" size={40} color="#8B0000" />
                                                <View style={styles.personInfo}>
                                                    <Text style={styles.personName}>{person.name}</Text>
                                                    {person.email && <Text style={styles.personDetail}>{person.email}</Text>}
                                                    {person.phone && <Text style={styles.personDetail}>{person.phone}</Text>}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                        </ScrollView>
                        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => router.push('/people')}>
                            <MaterialIcons name="add" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                );
            case 'settings':
                return (
                    <ScrollView style={styles.settingsContainer} contentContainerStyle={styles.settingsContent}>

                        <Text style={styles.cardTitle}>PROJECT INFORMATION</Text>
                        <View style={styles.settingsCard}>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <TouchableOpacity onPress={() => { setEditingField('projectName'); setEditingValue(projectSettings.projectName); setEditModalVisible(true); }}>
                                    <Text style={styles.settingLabel}>Project name</Text>
                                    <Text style={styles.placeholderText}>{projectSettings.projectName}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <TouchableOpacity onPress={() => { setEditingField('projectCode'); setEditingValue(projectSettings.projectCode); setEditModalVisible(true); }}>
                                    <Text style={styles.settingLabel}>Project code</Text>
                                    <Text style={styles.placeholderText}>{projectSettings.projectCode}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.settingItem}>
                                <TouchableOpacity onPress={() => { setEditingField('address'); setEditingValue(projectSettings.address); setEditModalVisible(true); }}>
                                    <Text style={styles.settingLabel}>Address</Text>
                                    <Text style={styles.placeholderText}>{projectSettings.address}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>GENERAL</Text>
                        <View style={styles.settingsCard}>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <TouchableOpacity onPress={() => setTimezoneModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Timezone</Text>
                                    <Text style={styles.placeholderText}>{timezone}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Currency</Text>
                                    <Text style={styles.placeholderText}>{currency}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.settingItem}>
                                <TouchableOpacity onPress={() => setMeasurementUnitModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Measurement unit</Text>
                                    <Text style={styles.placeholderText}>{measurementUnit}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>STORAGE</Text>
                        <View style={styles.settingsCard}>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <TouchableOpacity onPress={() => setArchiveTasksModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Archive tasks</Text>
                                    <Text style={styles.placeholderText}>{archiveTasksOption}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.settingItem}>
                                <TouchableOpacity onPress={() => setMobileStorageModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Mobile storage</Text>
                                    <Text style={styles.placeholderText}>{mobileStorageOption}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>TASKS</Text>
                        <View style={styles.settingsCard}>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <View style={styles.settingRow}>
                                    <Text style={styles.settingLabel}>Send email notifications</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setSendEmailChecked(!sendEmailChecked)}
                                    >
                                        <View style={[styles.checkbox, sendEmailChecked && styles.checkboxChecked]}>
                                            {sendEmailChecked && <MaterialCommunityIcons name="check" size={16} color="#ffffff" />}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.settingItem, styles.settingItemWithBorder]}>
                                <View style={styles.settingRow}>
                                    <Text style={styles.settingLabel}>Require cost and manpower</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setRequireCostChecked(!requireCostChecked)}
                                    >
                                        <View style={[styles.checkbox, requireCostChecked && styles.checkboxChecked]}>
                                            {requireCostChecked && <MaterialCommunityIcons name="check" size={16} color="#ffffff" />}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.settingItem}>
                                <TouchableOpacity onPress={() => setManpowerUnitModalVisible(true)}>
                                    <Text style={styles.settingLabel}>Manpower unit</Text>
                                    <Text style={styles.placeholderText}>{manpowerUnit}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.cardTitle}>SYNC</Text>
                        <View style={styles.settingsCard}>
                            <View style={styles.settingItem}>
                                <TouchableOpacity>
                                    <Text style={styles.settingLabel}>Last sync</Text>
                                    <Text style={styles.placeholderText}>{lastSync}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.dangerButton}>
                                <Text style={styles.buttonText}>REMOVE FROM DEVICE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryButton}>
                                <Text style={[styles.buttonText, styles.redButtonText]}>LEAVE PROJECT</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.footerText}>To archive or delete your project, log in to CrowsNest on the web.</Text>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with hamburger menu */}
            <View style={styles.header}>
                {activeSection === 'specifications' && searchOpen ? (
                    <>
                        <TouchableOpacity onPress={() => { setSearchOpen(false); setQuery(''); }} style={styles.iconBtn}>
                            <MaterialIcons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TextInput
                            ref={textInputRef}
                            autoFocus
                            placeholder="Spec section number or name"
                            placeholderTextColor="#7a7f83"
                            value={query}
                            onChangeText={setQuery}
                            style={styles.searchInputInHeader}
                        />
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={openSidebar} style={styles.menuBtn}>
                            <MaterialCommunityIcons name="menu" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {activeSection === 'specifications' ? 'Specifications' : activeSection === 'settings' ? 'Project settings' : activeSection === 'people' ? 'People' : (name || 'Project')}
                        </Text>
                        <View style={styles.headerRight}>
                            {activeSection === 'specifications' ? (
                                <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchOpen(true)}>
                                    <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                                </TouchableOpacity>
                            ) : activeSection === 'plans' ? (
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
                            ) : activeSection === 'settings' ? (
                                <View />
                            ) : (
                                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/people')}>
                                    <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                )}
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
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.sidebarTitle, { flex: 1 }]} numberOfLines={1}>
                                            {name || 'Project'}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.backToProjectsIcon}
                                            onPress={() => router.back()}
                                        >
                                            <MaterialCommunityIcons name="home-outline" size={20} color="#9aa0a6" />
                                        </TouchableOpacity>
                                    </View>
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

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setEditModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setEditModalVisible(false)}>
                    <View style={styles.editModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Edit {editingField === 'projectName' ? 'Project Name' : editingField === 'projectCode' ? 'Project Code' : 'Address'}
                            </Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <TextInput
                                style={styles.editInput}
                                value={editingValue}
                                onChangeText={setEditingValue}
                                placeholder="Enter value"
                                placeholderTextColor="#9aa0a6"
                                multiline={editingField === 'address'}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => {
                                        setProjectSettings(prev => ({ ...prev, [editingField]: editingValue }));
                                        setEditModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Manpower Unit Modal */}
            <Modal
                visible={manpowerUnitModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setManpowerUnitModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setManpowerUnitModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Manpower Unit</Text>
                            <TouchableOpacity onPress={() => setManpowerUnitModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            {['man-hours', 'man-days', 'man-months'].map((unit) => (
                                <TouchableOpacity
                                    key={unit}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setManpowerUnit(unit);
                                        setManpowerUnitModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, manpowerUnit === unit && styles.selectedModalOptionText]}>{unit}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Mobile Storage Modal */}
            <Modal
                visible={mobileStorageModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setMobileStorageModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setMobileStorageModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Mobile Storage Option</Text>
                            <TouchableOpacity onPress={() => setMobileStorageModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            {[
                                'Include all revisions',
                                ...Array.from({ length: 9 }, (_, i) => `Maximum ${i + 1} revision${i + 1 === 1 ? '' : 's'} per plan`)
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setMobileStorageOption(option);
                                        setMobileStorageModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, mobileStorageOption === option && styles.selectedModalOptionText]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Archive Tasks Modal */}
            <Modal
                visible={archiveTasksModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setArchiveTasksModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setArchiveTasksModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Archive Tasks Option</Text>
                            <TouchableOpacity onPress={() => setArchiveTasksModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            {[
                                'After 1 day',
                                'After 3 days',
                                'After 7 days',
                                'After 30 days',
                                'After 90 days',
                                'After 365 days',
                                'After 3650 days'
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setArchiveTasksOption(option);
                                        setArchiveTasksModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, archiveTasksOption === option && styles.selectedModalOptionText]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Measurement Unit Modal */}
            <Modal
                visible={measurementUnitModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setMeasurementUnitModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setMeasurementUnitModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Measurement Unit</Text>
                            <TouchableOpacity onPress={() => setMeasurementUnitModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            {['US/Imperial', 'Metric/SI'].map((unit) => (
                                <TouchableOpacity
                                    key={unit}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setMeasurementUnit(unit);
                                        setMeasurementUnitModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, measurementUnit === unit && styles.selectedModalOptionText]}>{unit}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Currency Modal */}
            <Modal
                visible={currencyModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setCurrencyModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Currency</Text>
                            <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            {[
                                'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'
                            ].map((curr) => (
                                <TouchableOpacity
                                    key={curr}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setCurrency(curr);
                                        setCurrencyModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, currency === curr && styles.selectedModalOptionText]}>{curr}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

            {/* Timezone Modal */}
            <Modal
                visible={timezoneModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setTimezoneModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setTimezoneModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Timezone</Text>
                            <TouchableOpacity onPress={() => setTimezoneModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            {[
                                '(GMT-08:00) Pacific Time - Los Angeles',
                                '(GMT-07:00) Mountain Time - Denver',
                                '(GMT-06:00) Central Time - Chicago',
                                '(GMT-05:00) Eastern Time - New York',
                                '(GMT+00:00) Greenwich Mean Time - London',
                                '(GMT+01:00) Central European Time - Paris',
                                '(GMT+09:00) Japan Standard Time - Tokyo',
                                '(GMT+10:00) Australian Eastern Time - Sydney'
                            ].map((tz) => (
                                <TouchableOpacity
                                    key={tz}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setTimezone(tz);
                                        setTimezoneModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalOptionText, timezone === tz && styles.selectedModalOptionText]}>{tz}</Text>
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
        textAlign: 'center',
    },
    contentSubtitle: {
        color: '#9aa0a6',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    contentSubtitleSmall: {
        color: '#9aa0a6',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
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
        alignItems: 'flex-start',
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    backToProjectsIcon: {
        padding: 8,
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
    searchInputInHeader: {
        flex: 1,
        color: '#fff',
        paddingVertical: 0,
        fontSize: 16,
        lineHeight: 22,
        height: 22,
        textAlignVertical: 'center',
        marginLeft: 8,
    },
    settingsContainer: {
        flex: 1,
        backgroundColor: '#0f1112',
    },
    settingsContent: {
        paddingVertical: 10,
    },
    settingsTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    settingSection: {
        marginBottom: 20,
    },
    settingLabel: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    placeholderText: {
        color: '#9aa0a6',
        fontSize: 14,
        marginTop: 2,
    },
    settingInput: {
        backgroundColor: '#1f1f1f',
        borderRadius: 6,
        padding: 12,
        color: '#ffffff',
        fontSize: 16,
    },
    settingsCard: {
        backgroundColor: '#161717',
        padding: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        width: '100%',
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        marginTop: 8,
        paddingLeft: 8,
    },
    settingItem: {
        marginBottom: 8,
    },
    settingItemWithBorder: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
        paddingBottom: 8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 5,
        marginBottom: 10,
    },
    dangerButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 4,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    redButtonText: {
        color: '#8B0000',
    },
    settingButton: {
        backgroundColor: '#1f1f1f',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    editModalContent: {
        backgroundColor: '#121417',
        borderRadius: 8,
        width: '90%',
        maxHeight: '60%',
    },
    editInput: {
        backgroundColor: '#1f1f1f',
        borderRadius: 6,
        padding: 12,
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#666',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#9aa0a6',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#8B0000',
        borderColor: '#8B0000',
    },
    footerText: {
        color: '#9aa0a6',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 2,
        marginHorizontal: 20,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    modalOptionText: {
        color: '#ffffff',
        fontSize: 16,
    },
    selectedModalOptionText: {
        color: '#8B0000',
    },
    peopleContainer: {
        flex: 1,
    },
    peopleScrollView: {
        flex: 1,
    },
    peopleContent: {
        padding: 20,
    },
    inviteButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    inviteButton: {
        backgroundColor: '#8B0000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 0.45,
        justifyContent: 'center',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    peopleList: {
        marginTop: 10,
    },
    personItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    personInfo: {
        marginLeft: 15,
        flex: 1,
    },
    personName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    personDetail: {
        fontSize: 14,
        color: '#9aa0a6',
        marginTop: 2,
    },
    contactsModalContent: {
        backgroundColor: '#121417',
        borderRadius: 8,
        width: '90%',
        maxHeight: '70%',
    },
    contactsList: {
        maxHeight: 300,
        marginBottom: 20,
    },
    contactItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    contactDetail: {
        fontSize: 14,
        color: '#9aa0a6',
        marginTop: 2,
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 76,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#8B0000',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    inviteOptionsModal: {
        backgroundColor: '#121417',
        borderRadius: 8,
        width: '80%',
        padding: 20,
    },
    inviteOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#1f1f1f',
        marginBottom: 10,
    },
    inviteOptionText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 15,
    },
    inviteContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
    },
    deviceContactsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    connectContactsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    connectContactsText: {
        color: '#8B0000',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
