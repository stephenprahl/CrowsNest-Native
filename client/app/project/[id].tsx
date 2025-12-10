import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

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
    { id: 'ai', label: 'AI Assistant', icon: 'robot' },
    { id: 'browser', label: 'Browser', icon: 'web' },
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

type Task = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    assignee?: string;
    priority: 'low' | 'medium' | 'high';
};

const SAMPLE_PLANS: Plan[] = [
    { id: '1', name: 'Floor Plan - Level 1', image: require('../../assets/images/plan-1.jpg') },
    { id: '2', name: 'Floor Plan - Level 2', image: require('../../assets/images/plan-2.jpg') },
];

const RECENTLY_VIEWED_PLANS: Plan[] = [
    { id: '1', name: 'Floor Plan - Level 1', image: require('../../assets/images/plan-1.jpg') },
    { id: '2', name: 'Floor Plan - Level 2', image: require('../../assets/images/plan-2.jpg') },
];

const SAMPLE_TASKS: Task[] = [
    {
        id: '1',
        title: 'Review electrical plans',
        description: 'Check all electrical wiring and outlet placements',
        completed: false,
        dueDate: '2024-01-15',
        assignee: 'John Doe',
        priority: 'high',
    },
    {
        id: '2',
        title: 'Order materials',
        description: 'Purchase lumber, concrete, and roofing materials',
        completed: true,
        dueDate: '2024-01-10',
        assignee: 'Jane Smith',
        priority: 'medium',
    },
    {
        id: '3',
        title: 'Schedule inspection',
        description: 'Contact local building department for foundation inspection',
        completed: false,
        dueDate: '2024-01-20',
        assignee: 'Bob Johnson',
        priority: 'high',
    },
    {
        id: '4',
        title: 'Update project timeline',
        description: 'Adjust timeline based on recent delays',
        completed: false,
        dueDate: '2024-01-12',
        assignee: 'Alice Brown',
        priority: 'low',
    },
];

export default function ProjectHomeScreen() {
    const { name } = useLocalSearchParams<{ id: string; name: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('plans');
    const [plansDropdownOpen, setPlansDropdownOpen] = useState(true);
    const [tasksDropdownOpen, setTasksDropdownOpen] = useState(true);
    const [plans] = useState(SAMPLE_PLANS);
    const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
    const [viewMode, setViewMode] = useState<'thumbnail' | 'list'>('thumbnail');
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [filesSearchOpen, setFilesSearchOpen] = useState(false);
    const [filesQuery, setFilesQuery] = useState('');
    const [plansQuery, setPlansQuery] = useState('');
    const [tasksSearchOpen, setTasksSearchOpen] = useState(false);
    const [tasksQuery, setTasksQuery] = useState('');
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

    const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const [measurementUnitModalVisible, setMeasurementUnitModalVisible] = useState(false);
    const [measurementUnit, setMeasurementUnit] = useState('US/Imperial');

    const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
    const [currency, setCurrency] = useState('USD');

    const [timezoneModalVisible, setTimezoneModalVisible] = useState(false);
    const [timezone, setTimezone] = useState('(GMT+00:00) Greenwich Mean Time - London');

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<'projectName' | 'projectCode' | 'address'>('projectName');
    const [editingValue, setEditingValue] = useState('');

    const [people, setPeople] = useState<Person[]>([]);

    const removePerson = (personId: string) => {
        setPeople(prev => prev.filter(person => person.id !== personId));
    };

    const toggleTaskCompletion = (taskId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const addTask = () => {
        if (newTaskTitle.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim() || undefined,
                completed: false,
                dueDate: newTaskDueDate || undefined,
                priority: newTaskPriority,
            };
            setTasks(prev => [...prev, newTask]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskDueDate('');
            setNewTaskPriority('medium');
            setAddTaskModalVisible(false);
        }
    };

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    const filteredTasks = tasks.filter(task => {
        if (taskFilter === 'completed') return task.completed;
        if (taskFilter === 'pending') return !task.completed;
        return true;
    });

    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'low': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'high': return '#F44336';
            default: return '#666';
        }
    };

    const [adminModalVisible, setAdminModalVisible] = useState(false);
    const [accessModalVisible, setAccessModalVisible] = useState(false);

    const [photosModalVisible, setPhotosModalVisible] = useState(false);

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
        if (itemId === 'ai') {
            router.push('/ai');
        } else {
            setActiveSection(itemId);
        }
        closeSidebar();
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'plans':
                return (
                    <ScrollView style={styles.plansListContainer} contentContainerStyle={styles.plansContentContainer}>
                        <View style={styles.plansWrapper}>
                            <View style={styles.searchContainer}>
                                <TextInput
                                    placeholder="Search plans..."
                                    placeholderTextColor="#7a7f83"
                                    value={plansQuery}
                                    onChangeText={setPlansQuery}
                                    style={styles.searchInput}
                                />
                                <TouchableOpacity style={styles.qrIcon}>
                                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="#9aa0a6" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.plansDropdown}
                                onPress={() => setPlansDropdownOpen(!plansDropdownOpen)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.plansDropdownLeft}>
                                    <MaterialCommunityIcons name="folder-outline" size={20} color="#9aa0a6" />
                                    <Text style={styles.plansDropdownText}>Unfiled plans</Text>
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
                    <View style={styles.tasksContainer}>
                        <ScrollView style={styles.tasksScrollView} contentContainerStyle={styles.tasksContent}>
                            <TouchableOpacity
                                style={styles.tasksDropdown}
                                onPress={() => setTasksDropdownOpen(!tasksDropdownOpen)}
                            >
                                <View style={styles.tasksDropdownLeft}>
                                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color="#9aa0a6" />
                                    <Text style={styles.tasksDropdownText}>PRIORITY</Text>
                                </View>
                                <View style={styles.tasksDropdownRight}>
                                    <Text style={styles.tasksCount}>({filteredTasks.length} tasks)</Text>
                                    <MaterialCommunityIcons
                                        name={tasksDropdownOpen ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color="#9aa0a6"
                                        style={styles.tasksDropdownChevron}
                                    />
                                </View>
                            </TouchableOpacity>

                            {tasksDropdownOpen && (
                                <>

                                    <View style={styles.taskFilters}>
                                        <TouchableOpacity
                                            style={[styles.filterButton, taskFilter === 'all' && styles.filterButtonActive]}
                                            onPress={() => setTaskFilter('all')}
                                        >
                                            <Text style={[styles.filterButtonText, taskFilter === 'all' && styles.filterButtonTextActive]}>
                                                All ({tasks.length})
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filterButton, taskFilter === 'pending' && styles.filterButtonActive]}
                                            onPress={() => setTaskFilter('pending')}
                                        >
                                            <Text style={[styles.filterButtonText, taskFilter === 'pending' && styles.filterButtonTextActive]}>
                                                Pending ({tasks.filter(t => !t.completed).length})
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.filterButton, taskFilter === 'completed' && styles.filterButtonActive]}
                                            onPress={() => setTaskFilter('completed')}
                                        >
                                            <Text style={[styles.filterButtonText, taskFilter === 'completed' && styles.filterButtonTextActive]}>
                                                Completed ({tasks.filter(t => t.completed).length})
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.tasksList}>
                                        {filteredTasks.length === 0 ? (
                                            <View style={styles.emptyTasks}>
                                                <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={60} color="#ccc" />
                                                <Text style={styles.emptyTasksText}>
                                                    {taskFilter === 'all' ? 'No tasks yet' :
                                                        taskFilter === 'pending' ? 'No pending tasks' : 'No completed tasks'}
                                                </Text>
                                                <Text style={styles.emptyTasksSubtext}>Tap &quot;Add Task&quot; to create your first task</Text>
                                            </View>
                                        ) : (
                                            filteredTasks.map((task) => (
                                                <View key={task.id} style={styles.taskItem}>
                                                    <TouchableOpacity
                                                        style={styles.taskCheckbox}
                                                        onPress={() => toggleTaskCompletion(task.id)}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                            size={24}
                                                            color={task.completed ? '#8B0000' : '#ccc'}
                                                        />
                                                    </TouchableOpacity>

                                                    <View style={styles.taskContent}>
                                                        <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                                                            {task.title}
                                                        </Text>
                                                        {task.description && (
                                                            <Text style={styles.taskDescription}>{task.description}</Text>
                                                        )}
                                                        <View style={styles.taskMeta}>
                                                            {task.dueDate && (
                                                                <View style={styles.taskMetaItem}>
                                                                    <MaterialCommunityIcons name="calendar" size={14} color="#666" />
                                                                    <Text style={styles.taskMetaText}>{task.dueDate}</Text>
                                                                </View>
                                                            )}
                                                            {task.assignee && (
                                                                <View style={styles.taskMetaItem}>
                                                                    <MaterialCommunityIcons name="account" size={14} color="#666" />
                                                                    <Text style={styles.taskMetaText}>{task.assignee}</Text>
                                                                </View>
                                                            )}
                                                            <View style={styles.taskMetaItem}>
                                                                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
                                                                <Text style={styles.taskMetaText}>{task.priority}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <TouchableOpacity
                                                        style={styles.taskDeleteButton}
                                                        onPress={() => deleteTask(task.id)}
                                                    >
                                                        <MaterialCommunityIcons name="delete" size={20} color="#ff4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                </>
                            )}
                        </ScrollView>

                        {!tasksDropdownOpen && !addTaskModalVisible && (
                            <TouchableOpacity
                                style={styles.addTaskFAB}
                                onPress={() => setAddTaskModalVisible(true)}
                            >
                                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                );
            case 'photos':
                return (
                    <View style={[styles.contentSection, { paddingTop: 50, justifyContent: 'flex-start' }]}>
                        <MaterialCommunityIcons name="image-multiple-outline" size={60} color="#8B0000" />
                        <Text style={styles.contentTitle}>Add photos, videos and 360° photos</Text>
                        <Text style={styles.contentSubtitle}>All photos stay organized here to help you and your team monitor progress on your project.</Text>
                    </View>
                );
            case 'forms':
                return (
                    <View style={[styles.contentSection, { paddingTop: 100, justifyContent: 'flex-start' }]}>
                        <View style={{ borderWidth: 2, borderColor: '#8B0000', borderRadius: 3, padding: 20, alignItems: 'center' }}>
                            <Text style={styles.formsModalTitle}>Upgrade to Business to access custom forms</Text>
                            <Text style={styles.formsModalSubtitle}>Standardize your jobsite processes with paperless forms and templates.</Text>
                            <MaterialCommunityIcons name="form-select" size={60} color="#8B0000" style={styles.formsModalIcon} />
                            <View style={styles.formsModalButtons}>
                                <TouchableOpacity style={styles.requestDemoButton} onPress={() => setActiveSection('plans')}>
                                    <Text style={styles.buttonText}>REQUEST DEMO</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.noThanksButton} onPress={() => setActiveSection('plans')}>
                                    <Text style={styles.buttonText}>NO, THANKS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            case 'files':
                return (
                    <ScrollView style={styles.plansListContainer} contentContainerStyle={styles.plansContentContainer}>
                        <View style={styles.contentSection}>
                            <MaterialCommunityIcons name="folder-outline" size={60} color="#8B0000" />
                            <Text style={styles.contentTitle}>Add files to centralize your project documentation</Text>
                            <Text style={styles.contentSubtitle}>Keep track of specifications, project submittals, or any other documents that are shared with your team.</Text>
                        </View>
                    </ScrollView>
                );
            case 'people':
                return (
                    <View style={styles.peopleContainer}>
                        <ScrollView style={styles.peopleScrollView} contentContainerStyle={styles.peopleContent}>
                            <View style={styles.adminHeader}>
                                <Text style={styles.adminTitle}>ADMIN</Text>
                                <Text style={styles.accountCount}>({people.length + 1})</Text>
                            </View>
                            <TouchableOpacity style={styles.adminContainer} onPress={() => setAdminModalVisible(true)}>
                                <View style={styles.adminInfo}>
                                    <View style={styles.adminUserRow}>
                                        <View style={styles.adminAvatar}>
                                            <MaterialCommunityIcons name="account-circle" size={50} color="#8B0000" />
                                            <View style={styles.adminBadge}>
                                                <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
                                            </View>
                                        </View>
                                        <View style={styles.adminTextContainer}>
                                            <Text style={styles.adminName}>John Doe</Text>
                                            <Text style={styles.adminCompany}>WickedUI</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
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
                                                <TouchableOpacity
                                                    style={styles.removeButton}
                                                    onPress={() => removePerson(person.id)}
                                                >
                                                    <MaterialIcons name="close" size={20} color="#ff4444" />
                                                </TouchableOpacity>
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
                    <ScrollView style={styles.settingsContainer} contentContainerStyle={[styles.settingsContent, { paddingBottom: insets.bottom + 10 }]}>

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
            case 'browser':
                return (
                    <View style={styles.browserContainer}>
                        <WebView
                            source={{ uri: 'https://www.google.com' }}
                            style={styles.webView}
                        />
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
                {(activeSection === 'specifications' && searchOpen) || (activeSection === 'files' && filesSearchOpen) || (activeSection === 'tasks' && tasksSearchOpen) ? (
                    <>
                        <TouchableOpacity onPress={() => {
                            if (activeSection === 'specifications') {
                                setSearchOpen(false);
                                setQuery('');
                            } else if (activeSection === 'files') {
                                setFilesSearchOpen(false);
                                setFilesQuery('');
                            } else if (activeSection === 'tasks') {
                                setTasksSearchOpen(false);
                                setTasksQuery('');
                            }
                        }} style={styles.iconBtn}>
                            <MaterialIcons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TextInput
                            ref={textInputRef}
                            autoFocus
                            placeholder={activeSection === 'specifications' ? "Spec section number or name" : activeSection === 'files' ? "Search files" : "Task name, @assignee, #tag"}
                            placeholderTextColor="#7a7f83"
                            value={activeSection === 'specifications' ? query : activeSection === 'files' ? filesQuery : tasksQuery}
                            onChangeText={activeSection === 'specifications' ? setQuery : activeSection === 'files' ? setFilesQuery : setTasksQuery}
                            style={styles.searchInputInHeader}
                        />
                        <TouchableOpacity style={styles.qrBtn} onPress={() => { }}>
                            <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={openSidebar} style={styles.menuBtn}>
                            <MaterialCommunityIcons name="menu" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle} numberOfLines={activeSection === 'files' || activeSection === 'photos' || activeSection === 'plans' || activeSection === 'tasks' ? 2 : 1}>
                            {activeSection === 'files' ? (
                                <>
                                    <Text style={styles.headerMainTitle}>Files</Text>
                                    {'\n'}
                                    <Text style={styles.headerSubTitle}>All Files</Text>
                                </>
                            ) : activeSection === 'photos' ? (
                                <>
                                    <Text style={styles.headerMainTitle}>Photos</Text>
                                    {'\n'}
                                    <Text style={styles.headerSubTitle}>All Photos</Text>
                                </>
                            ) : activeSection === 'plans' ? (
                                <>
                                    <Text style={styles.headerMainTitle}>Plans</Text>
                                    {'\n'}
                                    <Text style={styles.headerSubTitle}>All tasks on plans</Text>
                                </>
                            ) : activeSection === 'tasks' ? (
                                <>
                                    <Text style={styles.headerMainTitle}>Tasks</Text>
                                    {'\n'}
                                    <Text style={styles.headerSubTitle}>All Tasks</Text>
                                </>
                            ) : (
                                activeSection === 'specifications' ? 'Specifications' : activeSection === 'settings' ? 'Project settings' : activeSection === 'people' ? 'People' : (name || 'Project')
                            )}
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
                            ) : activeSection === 'files' ? (
                                <TouchableOpacity style={styles.iconBtn} onPress={() => setFilesSearchOpen(true)}>
                                    <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                                </TouchableOpacity>
                            ) : activeSection === 'photos' ? (
                                <TouchableOpacity style={styles.iconBtn} onPress={() => { }}>
                                    <MaterialCommunityIcons name="fullscreen" size={22} color="#fff" />
                                </TouchableOpacity>
                            ) : activeSection === 'tasks' ? (
                                <>
                                    <TouchableOpacity style={styles.iconBtn} onPress={() => setTasksSearchOpen(true)}>
                                        <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconBtn} onPress={() => {/* TODO: Add filters functionality */ }}>
                                        <MaterialCommunityIcons name="filter-variant" size={22} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconBtn} onPress={() => {/* TODO: Add upgrade functionality */ }}>
                                        <MaterialCommunityIcons name="crown" size={22} color="#fff" />
                                    </TouchableOpacity>
                                </>
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

            {(activeSection === 'files' || activeSection === 'photos') && (
                <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={async () => {
                    if (activeSection === 'files') {
                        alert('Button pressed');
                        try {
                            const result = await DocumentPicker.getDocumentAsync({
                                type: '*/*',
                                copyToCacheDirectory: true,
                            });
                            if (!result.canceled) {
                                alert(`File selected: ${result.assets[0].name}`);
                                // Here you can handle the file upload to your server or Filestack
                            } else {
                                alert('File selection cancelled');
                            }
                        } catch (error) {
                            alert(`Error picking file: ${error instanceof Error ? error.message : String(error)}`);
                        }
                    } else if (activeSection === 'photos') {
                        setPhotosModalVisible(true);
                    }
                }}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            )}

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
                                        <View style={styles.menuItemLeft}>
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
                                        </View>
                                        {item.id === 'forms' && (
                                            <MaterialCommunityIcons
                                                name="lock"
                                                size={22}
                                                color={activeSection === item.id ? '#8B0000' : '#9aa0a6'}
                                            />
                                        )}
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

            {/* Admin Modal */}
            <Modal
                visible={adminModalVisible}
                animationType="slide"
                onRequestClose={() => setAdminModalVisible(false)}
            >
                <View style={styles.adminModalContainer}>
                    <View style={styles.adminModalHeader}>
                        <TouchableOpacity onPress={() => setAdminModalVisible(false)} style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <Text style={styles.adminModalHeaderTitle}>Administrator</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <ScrollView style={styles.adminModalContent} contentContainerStyle={styles.adminModalContentContainer}>
                        <View style={styles.adminModalProfile}>
                            <View style={styles.adminModalAvatar}>
                                <MaterialCommunityIcons name="account-circle" size={120} color="#8B0000" />
                                <View style={styles.adminModalBadge}>
                                    <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
                                </View>
                            </View>
                            <Text style={styles.adminModalName}>John Doe</Text>
                            <Text style={styles.adminModalCompany}>WickedUI</Text>
                            <Text style={styles.adminModalRole}>Project Administrator</Text>
                        </View>
                        <View style={styles.adminModalSeparator} />
                        <View style={styles.adminModalDetails}>
                            <View style={styles.adminModalDetailItem}>
                                <View style={styles.adminModalIconsContainer}>
                                    <MaterialIcons name="phone" size={20} color="#8B0000" />
                                    <MaterialIcons name="sms" size={20} color="#8B0000" style={styles.iconSpacing} />
                                </View>
                                <Text style={styles.adminModalDetail}>+1 555-555-5555</Text>
                            </View>
                            <View style={styles.adminModalDetailItem}>
                                <MaterialIcons name="email" size={20} color="#8B0000" />
                                <Text style={styles.adminModalDetail}>john@example.com</Text>
                            </View>
                            <TouchableOpacity style={styles.adminModalDetailItem} onPress={() => setAccessModalVisible(true)}>
                                <View style={styles.adminModalDetailContent}>
                                    <Text style={styles.adminModalDetail}>Full Project Access</Text>
                                    <Text style={styles.adminModalDetailSecondary}>Admin</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={styles.adminModalActions}>
                        <TouchableOpacity style={styles.leaveProjectButton} onPress={() => setAdminModalVisible(false)}>
                            <Text style={styles.leaveProjectText}>Leave Project</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Access Level Modal */}
            <Modal
                visible={accessModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setAccessModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.accessModalOverlay}
                    activeOpacity={1}
                    onPress={() => setAccessModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.accessModalContainer}
                        activeOpacity={1}
                        onPress={() => { }} // Prevent closing when pressing modal content
                    >
                        <Text style={styles.accessModalTitle}>Select project access</Text>
                        <Text style={styles.accessModalSubtitle}>Learn more about access levels here</Text>

                        <View style={styles.accessOptionsContainer}>
                            <TouchableOpacity style={styles.accessOptionSelected} onPress={() => setAccessModalVisible(false)}>
                                <Text style={styles.accessOptionTextSelected}>Admin</Text>
                                <Text style={styles.accessOptionDescription}>See and control everything on project</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.accessOption} onPress={() => setAccessModalVisible(false)}>
                                <Text style={styles.accessOptionText}>Member</Text>
                                <Text style={styles.accessOptionDescription}>See all tasks associated with the project, but can&apos;t verify tasks or add plans</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.accessOption} onPress={() => setAccessModalVisible(false)}>
                                <Text style={styles.accessOptionText}>Follower</Text>
                                <Text style={styles.accessOptionDescription}>Similar to member, but can only see their own tasks (best for outside companies)</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Photos Modal */}
            <Modal
                visible={photosModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPhotosModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.photosModalOverlay}
                    activeOpacity={1}
                    onPress={() => setPhotosModalVisible(false)}
                >
                    <View style={styles.photosModalContainer}>
                        <TouchableOpacity style={styles.photosModalOption} onPress={() => { setPhotosModalVisible(false); alert('Take photo'); }}>
                            <MaterialCommunityIcons name="camera" size={20} color="#888" />
                            <Text style={styles.photosModalOptionText}>Take photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photosModalOption} onPress={() => { setPhotosModalVisible(false); alert('Upload from device'); }}>
                            <MaterialCommunityIcons name="upload" size={20} color="#888" />
                            <Text style={styles.photosModalOptionText}>Upload from device</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photosModalOption} onPress={() => { setPhotosModalVisible(false); alert('Take 360° photo'); }}>
                            <MaterialCommunityIcons name="panorama" size={20} color="#888" />
                            <Text style={styles.photosModalOptionText}>Take 360° photo</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Add Task Modal */}
            <Modal
                visible={addTaskModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setAddTaskModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay}>
                    <View style={styles.addTaskModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Task</Text>
                            <TouchableOpacity onPress={() => setAddTaskModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.addTaskModalBody}>
                            <Text style={styles.inputLabel}>Task Title *</Text>
                            <TextInput
                                style={styles.taskInput}
                                placeholder="Enter task title"
                                placeholderTextColor="#7a7f83"
                                value={newTaskTitle}
                                onChangeText={setNewTaskTitle}
                                maxLength={100}
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.taskInput, styles.taskDescriptionInput]}
                                placeholder="Enter task description (optional)"
                                placeholderTextColor="#7a7f83"
                                value={newTaskDescription}
                                onChangeText={setNewTaskDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={500}
                            />

                            <Text style={styles.inputLabel}>Due Date</Text>
                            <TextInput
                                style={styles.taskInput}
                                placeholder="YYYY-MM-DD (optional)"
                                placeholderTextColor="#7a7f83"
                                value={newTaskDueDate}
                                onChangeText={setNewTaskDueDate}
                            />

                            <Text style={styles.inputLabel}>Priority</Text>
                            <View style={styles.priorityButtons}>
                                {(['low', 'medium', 'high'] as const).map((priority) => (
                                    <TouchableOpacity
                                        key={priority}
                                        style={[
                                            styles.priorityButton,
                                            newTaskPriority === priority && styles.priorityButtonActive
                                        ]}
                                        onPress={() => setNewTaskPriority(priority)}
                                    >
                                        <Text style={[
                                            styles.priorityButtonText,
                                            newTaskPriority === priority && styles.priorityButtonTextActive
                                        ]}>
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.addTaskModalButtons}>
                                <TouchableOpacity
                                    style={styles.taskCancelButton}
                                    onPress={() => setAddTaskModalVisible(false)}
                                >
                                    <Text style={styles.taskCancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.addButton, !newTaskTitle.trim() && styles.addButtonDisabled]}
                                    onPress={addTask}
                                    disabled={!newTaskTitle.trim()}
                                >
                                    <Text style={styles.addButtonText}>Add Task</Text>
                                </TouchableOpacity>
                            </View>
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
        color: '#cccccc',
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
    tasksDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tasksDropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tasksDropdownRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tasksDropdownText: {
        color: '#cccccc',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 10,
        marginRight: 6,
    },
    tasksCount: {
        color: '#9aa0a6',
        fontSize: 14,
        marginRight: 4,
    },
    tasksDropdownChevron: {
        marginLeft: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        paddingVertical: 0,
    },
    qrIcon: {
        marginLeft: 8,
        padding: 4,
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
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 6,
        marginBottom: 16,
        marginRight: 8,
        marginLeft: 8,
        overflow: 'hidden',
        width: '45%',
    },
    planImageContainer: {
        padding: 8,
        paddingBottom: 0,
    },
    planImage: {
        width: '100%',
        height: 100,
        backgroundColor: '#1f1f1f',
        borderRadius: 4,
    },
    planCardOverlay: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
    },
    planCardTitle: {
        color: '#cccccc',
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
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 6,
        marginBottom: 16,
        padding: 12,
        width: '100%',
    },
    planListText: {
        color: '#cccccc',
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
        justifyContent: 'space-between',
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
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 14,
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
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderRadius: 12,
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
        zIndex: 102,
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
    adminContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        paddingVertical: 12,
        paddingLeft: 24,
        paddingRight: 8,
        marginBottom: 16,
        marginHorizontal: -40,
        borderWidth: 1,
        borderColor: '#333',
    },
    adminInfo: {
        flex: 1,
    },
    adminTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9aa0a6',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    adminUserRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    adminAvatar: {
        position: 'relative',
    },
    adminBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#8B0000',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    adminName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        lineHeight: 20,
    },
    adminCompany: {
        fontSize: 14,
        color: '#9aa0a6',
        marginTop: 2,
        lineHeight: 16,
    },
    adminRole: {
        fontSize: 12,
        color: '#FFD700',
        marginTop: 4,
        fontWeight: '600',
    },
    accountCount: {
        fontSize: 16,
        color: '#9aa0a6',
    },
    adminHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginHorizontal: -40,
        paddingHorizontal: 40,
    },
    adminModalContainer: {
        flex: 1,
        backgroundColor: '#0f1112',
    },
    adminModalHeader: {
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
    adminModalHeaderTitle: {
        flex: 1,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
    },
    adminModalContent: {
        flex: 1,
    },
    adminModalContentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    adminModalProfile: {
        alignItems: 'center',
        marginBottom: 20,
    },
    adminModalAvatar: {
        position: 'relative',
        marginBottom: 16,
    },
    adminModalBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#8B0000',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#0f1112',
    },
    adminModalName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    adminModalCompany: {
        fontSize: 18,
        color: '#9aa0a6',
        marginBottom: 8,
    },
    adminModalRole: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: '600',
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    adminModalSeparator: {
        height: 1,
        backgroundColor: '#333',
        width: '100%',
        marginVertical: 20,
    },
    adminModalDetails: {
        width: '100%',
    },
    adminModalDetailItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#1f1f1f',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    adminModalDetail: {
        fontSize: 16,
        color: '#ffffff',
        marginRight: 12,
        flex: 1,
    },
    adminModalDetailContent: {
        flex: 1,
    },
    adminModalDetailSecondary: {
        fontSize: 12,
        color: '#9aa0a6',
        marginTop: 4,
    },
    adminModalIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginLeft: 12,
    },
    adminModalActions: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    adminModalActionButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    adminModalActionText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    leaveProjectButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff0000',
        marginTop: -20,
    },
    leaveProjectText: {
        color: '#ff0000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    accessModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accessModalContainer: {
        backgroundColor: '#1f1f1f',
        borderRadius: 4,
        padding: 16,
        margin: 20,
        width: '90%',
        maxWidth: 360,
        alignItems: 'center',
    },
    accessModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 4,
    },
    accessModalSubtitle: {
        fontSize: 14,
        color: '#9aa0a6',
        textAlign: 'center',
        marginBottom: 12,
    },
    accessOptionsContainer: {
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 8,
    },
    accessOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    accessOptionText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },
    accessModalCancel: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    accessModalCancelText: {
        fontSize: 16,
        color: '#9aa0a6',
        fontWeight: '500',
    },
    accessOptionSelected: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    accessOptionTextSelected: {
        fontSize: 16,
        color: '#8B0000',
        fontWeight: '500',
    },
    accessOptionDescription: {
        fontSize: 12,
        color: '#9aa0a6',
        marginTop: 2,
        fontStyle: 'italic',
    },
    headerMainTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
    headerSubTitle: {
        fontSize: 12,
        color: '#9aa0a6',
    },
    photosModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    photosModalContainer: {
        backgroundColor: '#1f1f1f',
        width: '100%',
        paddingHorizontal: 0,
        paddingTop: 10,
        paddingBottom: 0,
    },
    photosModalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    photosModalOptionText: {
        fontSize: 16,
        color: '#ffffff',
        marginLeft: 15,
    },
    formsModalContent: {
        backgroundColor: '#121417',
        borderRadius: 8,
        width: '90%',
        padding: 24,
        alignItems: 'center',
    },
    formsModalTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    formsModalSubtitle: {
        color: '#9aa0a6',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    formsModalIcon: {
        marginBottom: 24,
    },
    formsModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    requestDemoButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#8B0000',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    noThanksButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#9aa0a6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    // Tasks styles
    tasksContainer: {
        flex: 1,
        position: 'relative',
    },
    tasksScrollView: {
        flex: 1,
    },
    tasksContent: {
        padding: 16,
    },
    tasksHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tasksTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    addTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8B0000',
    },
    addTaskButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    taskFilters: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginHorizontal: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: 'transparent',
        borderColor: '#8B0000',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#9aa0a6',
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: '#8B0000',
    },
    tasksList: {
        flex: 1,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1f1f1f',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    taskCheckbox: {
        marginRight: 12,
        marginTop: 2,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    taskDescription: {
        fontSize: 14,
        color: '#9aa0a6',
        marginBottom: 8,
    },
    taskMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    taskMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    taskMetaText: {
        fontSize: 12,
        color: '#9aa0a6',
        marginLeft: 4,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    taskDeleteButton: {
        padding: 4,
        marginTop: 2,
    },
    emptyTasks: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTasksText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyTasksSubtext: {
        fontSize: 14,
        color: '#9aa0a6',
        textAlign: 'center',
    },
    addTaskFAB: {
        position: 'absolute',
        bottom: 76,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#8B0000',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addTaskModalContent: {
        backgroundColor: '#1f1f1f',
        margin: 20,
        marginHorizontal: 5,
        width: '95%',
        borderRadius: 3,
        maxHeight: '80%',
    },
    addTaskModalBody: {
        padding: 20,
        paddingTop: 10,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
        marginTop: 0,
    },
    taskInput: {
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        padding: 12,
        color: '#ffffff',
        fontSize: 16,
    },
    taskDescriptionInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    priorityButtons: {
        flexDirection: 'row',
        marginTop: 8,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 6,
        marginHorizontal: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: 'transparent',
        borderColor: '#8B0000',
    },
    priorityButtonText: {
        fontSize: 14,
        color: '#9aa0a6',
        fontWeight: '500',
    },
    priorityButtonTextActive: {
        color: '#8B0000',
    },
    addTaskModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    taskCancelButton: {
        flex: 1,
        paddingVertical: 10,
        marginRight: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    taskCancelButtonText: {
        fontSize: 16,
        color: '#8B0000',
        fontWeight: '500',
    },
    addButton: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8B0000',
        alignItems: 'center',
    },
    addButtonDisabled: {
        borderColor: '#333',
    },
    addButtonText: {
        fontSize: 16,
        color: '#9aa0a6',
        fontWeight: '600',
    },
    qrBtn: {
        marginLeft: 8,
        padding: 6,
    },
    browserContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
});
