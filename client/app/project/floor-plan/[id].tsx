import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { floorPlanAPI, geminiAPI } from '../../../api';
import { AppContext } from '../../../state/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const planImages = {
    '1': require('../../../assets/images/plan-1.jpg'),
    '2': require('../../../assets/images/plan-2.jpg'),
}; export default function FloorPlanScreen() {
    const { id, name, image } = useLocalSearchParams<{ id: string; name: string; image: string }>();
    const context = useContext(AppContext);
    const { userId } = context || {};
    const router = useRouter();
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [leftDropdownVisible, setLeftDropdownVisible] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(true);
    const [aiModalVisible, setAiModalVisible] = useState(false);
    const [aiMessages, setAiMessages] = useState<Message[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [currentTool, setCurrentTool] = useState<string | null>(null);
    const [annotations, setAnnotations] = useState<any[]>([]);
    const [drawingSquare, setDrawingSquare] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const [drawingRuler, setDrawingRuler] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
    const [selectedColor, setSelectedColor] = useState('#8B0000');
    const colors = ['#8B0000', '#0000FF', '#008000', '#FFFF00', '#FFA500'];

    // Zoom state
    const [zoomScale, setZoomScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const lastDistance = useRef(0);
    const lastCenter = useRef({ x: 0, y: 0 });
    const lastTapTime = useRef(0);

    // Preview zoom state
    const [previewZoomScale, setPreviewZoomScale] = useState(1);
    const [previewPanOffset, setPreviewPanOffset] = useState({ x: 0, y: 0 });
    const [previewIsZooming, setPreviewIsZooming] = useState(false);
    const previewLastDistance = useRef(0);
    const previewLastCenter = useRef({ x: 0, y: 0 });
    const previewLastTapTime = useRef(0);

    // Load annotations on mount
    useEffect(() => {
        const loadAnnotations = async () => {
            if (userId && id) {
                try {
                    const response = await floorPlanAPI.getAnnotations(id);
                    if (response.success && response.data) {
                        setAnnotations(response.data);
                    }
                } catch (error) {
                    console.error('Failed to load annotations:', error);
                }
            }
        };
        loadAnnotations();
    }, [userId, id]);

    // Save annotations when they change
    useEffect(() => {
        const saveAnnotations = async () => {
            if (userId && id && annotations.length > 0) {
                try {
                    await floorPlanAPI.saveAnnotations(id, annotations);
                } catch (error) {
                    console.error('Failed to save annotations:', error);
                }
            }
        };
        // Debounce save
        const timeout = setTimeout(saveAnnotations, 1000);
        return () => clearTimeout(timeout);
    }, [annotations, userId, id]);

    const sendAiMessage = async () => {
        if (!aiInput.trim() || aiLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: aiInput.trim(),
        };

        setAiMessages(prev => [...prev, userMessage]);
        setAiInput('');
        setAiLoading(true);

        try {
            const response = await geminiAPI.generate(userMessage.content);
            if (response.success && response.data) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.data.response,
                };
                setAiMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setAiMessages(prev => [...prev, errorMessage]);
        } finally {
            setAiLoading(false);
        }
    };

    const renderAiMessage = ({ item }: { item: Message }) => (
        <View style={[styles.aiMessage, item.role === 'user' ? styles.userAiMessage : styles.assistantAiMessage]}>
            <Text style={styles.aiMessageText}>{item.content}</Text>
        </View>
    );

    // Pan responder for zoom functionality
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                setIsZooming(true);
                if (currentTool === 'square') {
                    const { locationX, locationY } = evt.nativeEvent;
                    setDrawingSquare({ startX: locationX, startY: locationY, endX: locationX, endY: locationY });
                }
                if (currentTool === 'ruler') {
                    const { locationX, locationY } = evt.nativeEvent;
                    setDrawingRuler({ startX: locationX, startY: locationY, endX: locationX, endY: locationY });
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!currentTool) {
                    if (gestureState.numberActiveTouches === 2) {
                        // Pinch to zoom
                        const touches = evt.nativeEvent.touches;
                        const touch1 = touches[0];
                        const touch2 = touches[1];

                        const distance = Math.sqrt(
                            Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
                        );

                        const center = {
                            x: (touch1.pageX + touch2.pageX) / 2,
                            y: (touch1.pageY + touch2.pageY) / 2,
                        };

                        if (lastDistance.current > 0) {
                            const scale = distance / lastDistance.current;
                            const newScale = Math.max(0.5, Math.min(3, zoomScale * scale));
                            setZoomScale(newScale);

                            // Adjust pan offset based on center point
                            const centerOffset = {
                                x: center.x - SCREEN_WIDTH / 2,
                                y: center.y - SCREEN_HEIGHT / 2,
                            };
                            setPanOffset(centerOffset);
                        }

                        lastDistance.current = distance;
                        lastCenter.current = center;
                    } else if (gestureState.numberActiveTouches === 1 && zoomScale > 1) {
                        // Pan when zoomed in
                        setPanOffset({
                            x: panOffset.x + gestureState.dx,
                            y: panOffset.y + gestureState.dy,
                        });
                    }
                } else if (currentTool === 'square' && drawingSquare) {
                    const { locationX, locationY } = evt.nativeEvent;
                    setDrawingSquare(prev => prev ? { ...prev, endX: locationX, endY: locationY } : null);
                } else if (currentTool === 'ruler' && drawingRuler) {
                    const { locationX, locationY } = evt.nativeEvent;
                    setDrawingRuler(prev => prev ? { ...prev, endX: locationX, endY: locationY } : null);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                setIsZooming(false);
                lastDistance.current = 0;

                if (drawingSquare) {
                    // Finish drawing square
                    setAnnotations(prev => [...prev, { 
                        type: 'square', 
                        x: drawingSquare.startX, 
                        y: drawingSquare.startY, 
                        width: drawingSquare.endX - drawingSquare.startX, 
                        height: drawingSquare.endY - drawingSquare.startY,
                        color: selectedColor
                    }]);
                    setDrawingSquare(null);
                } else if (drawingRuler) {
                    // Finish drawing ruler
                    const distance = Math.sqrt(
                        Math.pow(drawingRuler.endX - drawingRuler.startX, 2) + Math.pow(drawingRuler.endY - drawingRuler.startY, 2)
                    );
                    setAnnotations(prev => [...prev, { 
                        type: 'ruler', 
                        x: drawingRuler.startX, 
                        y: drawingRuler.startY, 
                        endX: drawingRuler.endX, 
                        endY: drawingRuler.endY,
                        distance: Math.round(distance),
                        color: selectedColor
                    }]);
                    setDrawingRuler(null);
                } else if (currentTool && gestureState.dx === 0 && gestureState.dy === 0) {
                    // Handle tool tap
                    const { locationX, locationY } = evt.nativeEvent;
                    if (currentTool === 'marker') {
                        setAnnotations(prev => [...prev, { type: 'marker', x: locationX, y: locationY, color: selectedColor }]);
                    }
                    if (currentTool === 'link') {
                        setAnnotations(prev => [...prev, { type: 'link', x: locationX, y: locationY, color: selectedColor }]);
                    }
                    if (currentTool === 'toolbox') {
                        setAnnotations(prev => [...prev, { type: 'toolbox', x: locationX, y: locationY, color: selectedColor }]);
                    }
                    if (currentTool === 'compass') {
                        setAnnotations(prev => [...prev, { type: 'compass', x: locationX, y: locationY, color: selectedColor }]);
                    }
                    // Add other tools here
                } else if (!currentTool) {
                    // Handle double tap to reset zoom
                    const now = Date.now();
                    if (now - lastTapTime.current < 300) {
                        setZoomScale(1);
                        setPanOffset({ x: 0, y: 0 });
                    }
                    lastTapTime.current = now;
                }
            },
        })
    );

    // Pan responder for preview zoom functionality
    const previewPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setPreviewIsZooming(true);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.numberActiveTouches === 2) {
                    // Pinch to zoom
                    const touches = evt.nativeEvent.touches;
                    const touch1 = touches[0];
                    const touch2 = touches[1];

                    const distance = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
                    );

                    const center = {
                        x: (touch1.pageX + touch2.pageX) / 2,
                        y: (touch1.pageY + touch2.pageY) / 2,
                    };

                    if (previewLastDistance.current > 0) {
                        const scale = distance / previewLastDistance.current;
                        const newScale = Math.max(0.5, Math.min(3, previewZoomScale * scale));
                        setPreviewZoomScale(newScale);

                        // Adjust pan offset based on center point
                        const centerOffset = {
                            x: center.x - SCREEN_WIDTH / 2,
                            y: center.y - SCREEN_HEIGHT / 2,
                        };
                        setPreviewPanOffset(centerOffset);
                    }

                    previewLastDistance.current = distance;
                    previewLastCenter.current = center;
                } else if (gestureState.numberActiveTouches === 1 && previewZoomScale > 1) {
                    // Pan when zoomed in
                    setPreviewPanOffset({
                        x: previewPanOffset.x + gestureState.dx,
                        y: previewPanOffset.y + gestureState.dy,
                    });
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                setPreviewIsZooming(false);
                previewLastDistance.current = 0;

                // Handle double tap to reset zoom
                const now = Date.now();
                if (now - previewLastTapTime.current < 300) {
                    setPreviewZoomScale(1);
                    setPreviewPanOffset({ x: 0, y: 0 });
                }
                previewLastTapTime.current = now;
            },
        })
    );

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
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setAiModalVisible(true)}>
                                <MaterialCommunityIcons name="robot" size={22} color="#fff" />
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
                <View
                    style={styles.imageWrapper}
                    {...panResponder.current.panHandlers}
                >
                    <Image
                        source={planImages[id as keyof typeof planImages]}
                        style={[
                            styles.floorPlanImage,
                            {
                                transform: [
                                    { scale: zoomScale },
                                    { translateX: panOffset.x },
                                    { translateY: panOffset.y },
                                ],
                            },
                        ]}
                        contentFit="contain"
                    />
                    {annotations.map((annotation, index) => (
                        <View
                            key={index}
                            style={{
                                position: 'absolute',
                                left: annotation.x - 12, // center the icon
                                top: annotation.y - 24,
                            }}
                        >
                            {annotation.type === 'marker' && (
                                <MaterialCommunityIcons name="map-marker" size={24} color={annotation.color || '#8B0000'} />
                            )}
                            {annotation.type === 'square' && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: annotation.x,
                                        top: annotation.y,
                                        width: Math.abs(annotation.width),
                                        height: Math.abs(annotation.height),
                                        borderWidth: 2,
                                        borderColor: annotation.color || '#8B0000',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            )}
                            {annotation.type === 'link' && (
                                <MaterialCommunityIcons name="link" size={24} color={annotation.color || '#8B0000'} />
                            )}
                            {annotation.type === 'text' && (
                                <Text style={{ position: 'absolute', left: annotation.x, top: annotation.y, color: annotation.color || '#8B0000', fontSize: 16 }}>
                                    {annotation.text}
                                </Text>
                            )}
                            {annotation.type === 'toolbox' && (
                                <MaterialCommunityIcons name="toolbox" size={24} color={annotation.color || '#8B0000'} />
                            )}
                            {annotation.type === 'compass' && (
                                <MaterialCommunityIcons name="compass" size={24} color={annotation.color || '#8B0000'} />
                            )}
                            {annotation.type === 'ruler' && (
                                <View style={{ position: 'absolute', left: annotation.x, top: annotation.y }}>
                                    <View
                                        style={{
                                            width: Math.abs(annotation.endX - annotation.x),
                                            height: Math.abs(annotation.endY - annotation.y),
                                            borderWidth: 1,
                                            borderColor: annotation.color || '#8B0000',
                                            backgroundColor: 'transparent',
                                        }}
                                    />
                                    <Text style={{ position: 'absolute', left: (annotation.endX - annotation.x) / 2, top: (annotation.endY - annotation.y) / 2, color: annotation.color || '#8B0000', fontSize: 12 }}>
                                        {annotation.distance}px
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                    {drawingSquare && (
                        <View
                            style={{
                                position: 'absolute',
                                left: drawingSquare.startX,
                                top: drawingSquare.startY,
                                width: Math.abs(drawingSquare.endX - drawingSquare.startX),
                                height: Math.abs(drawingSquare.endY - drawingSquare.startY),
                                borderWidth: 2,
                                borderColor: selectedColor,
                                backgroundColor: 'transparent',
                            }}
                        />
                    )}
                    {drawingRuler && (
                        <View
                            style={{
                                position: 'absolute',
                                left: Math.min(drawingRuler.startX, drawingRuler.endX),
                                top: Math.min(drawingRuler.startY, drawingRuler.endY),
                                width: Math.abs(drawingRuler.endX - drawingRuler.startX),
                                height: Math.abs(drawingRuler.endY - drawingRuler.startY),
                                borderWidth: 1,
                                borderColor: selectedColor,
                                backgroundColor: 'transparent',
                            }}
                        />
                    )}
                </View>
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
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'marker' ? null : 'marker')}>
                                <MaterialCommunityIcons name="map-marker" size={24} color={currentTool === 'marker' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'link' ? null : 'link')}>
                                <MaterialCommunityIcons name="link" size={24} color={currentTool === 'link' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'pencil' ? null : 'pencil')}>
                                <MaterialCommunityIcons name="pencil" size={24} color={currentTool === 'pencil' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'square' ? null : 'square')}>
                                <MaterialCommunityIcons name="square" size={24} color={currentTool === 'square' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'toolbox' ? null : 'toolbox')}>
                                <MaterialCommunityIcons name="toolbox" size={24} color={currentTool === 'toolbox' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'text' ? null : 'text')}>
                                <MaterialCommunityIcons name="format-font-size-increase" size={24} color={currentTool === 'text' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'ruler' ? null : 'ruler')}>
                                <MaterialCommunityIcons name="ruler" size={24} color={currentTool === 'ruler' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedColor(colors[(colors.indexOf(selectedColor) + 1) % colors.length])}>
                                <View style={[styles.colorCircleIcon, { backgroundColor: selectedColor }]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentTool(currentTool === 'compass' ? null : 'compass')}>
                                <MaterialCommunityIcons name="compass" size={24} color={currentTool === 'compass' ? '#8B0000' : '#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setAnnotations(prev => prev.slice(0, -1))}>
                                <MaterialCommunityIcons name="undo" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setAnnotations([])}>
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

            {/* AI Modal */}
            <Modal
                visible={aiModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAiModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setAiModalVisible(false)}
                    />
                    <View style={styles.aiModalContent}>
                        <View style={styles.aiModalHeader}>
                            <Text style={styles.aiModalTitle}>AI Assistant</Text>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity onPress={() => setShowImagePreview(true)}>
                                    <Ionicons name="image" size={24} color="#ffffff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setAiModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <KeyboardAvoidingView
                            style={styles.aiModalBody}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View style={styles.aiInitialContainer}>
                                <Image source={planImages[id as keyof typeof planImages]} style={styles.aiPlanImage} />
                            </View>
                            <FlatList
                                data={aiMessages}
                                keyExtractor={(item) => item.id}
                                renderItem={renderAiMessage}
                                style={styles.aiMessagesList}
                                contentContainerStyle={styles.aiMessagesContainer}
                                showsVerticalScrollIndicator={false}
                            />

                            <View style={styles.aiInputContainer}>
                                <TextInput
                                    style={styles.aiInput}
                                    placeholder="Ask me about this floor plan..."
                                    placeholderTextColor="#7a7f83"
                                    value={aiInput}
                                    onChangeText={setAiInput}
                                    multiline
                                    maxLength={1000}
                                />
                                <TouchableOpacity
                                    style={[styles.aiSendButton, (!aiInput.trim() || aiLoading) && styles.aiSendButtonDisabled]}
                                    onPress={sendAiMessage}
                                    disabled={!aiInput.trim() || aiLoading}
                                >
                                    {aiLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="send" size={20} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>

            {/* Image Preview Modal */}
            <Modal
                visible={showImagePreview}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImagePreview(false)}
            >
                <View style={styles.previewOverlay}>
                    <TouchableOpacity
                        style={styles.previewBackdrop}
                        activeOpacity={1}
                        onPress={() => {
                            setShowImagePreview(false);
                            setPreviewZoomScale(1);
                            setPreviewPanOffset({ x: 0, y: 0 });
                        }}
                    />
                    <View style={styles.previewContent}>
                        <View
                            style={styles.previewImageWrapper}
                            {...previewPanResponder.current.panHandlers}
                        >
                            <Image
                                source={planImages[id as keyof typeof planImages]}
                                style={[
                                    styles.previewImage,
                                    {
                                        transform: [
                                            { scale: previewZoomScale },
                                            { translateX: previewPanOffset.x },
                                            { translateY: previewPanOffset.y },
                                        ],
                                    },
                                ]}
                                contentFit="contain"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.previewClose}
                            onPress={() => {
                                setShowImagePreview(false);
                                setPreviewZoomScale(1);
                                setPreviewPanOffset({ x: 0, y: 0 });
                            }}
                        >
                            <Ionicons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 0,
        marginTop: -10,
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
        paddingBottom: 40,
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
    aiModalContent: {
        backgroundColor: '#121417',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        height: '80%',
        maxHeight: 600,
        paddingBottom: 4,
    },
    aiModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f1f',
    },
    aiModalTitle: {
        color: '#8B0000',
        fontSize: 18,
        fontWeight: '700',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    aiModalBody: {
        flex: 1,
    },
    aiMessagesList: {
        flex: 1,
    },
    aiMessagesContainer: {
        padding: 16,
    },
    aiMessage: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    userAiMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#8B0000',
    },
    assistantAiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#1f1f1f',
    },
    aiMessageText: {
        color: '#ffffff',
        fontSize: 16,
    },
    aiInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: '#1f1f1f',
    },
    aiInput: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#ffffff',
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    aiSendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8B0000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiSendButtonDisabled: {
        backgroundColor: '#333',
    },
    aiInitialContainer: {
        alignItems: 'center',
        padding: 16,
    },
    aiPlanImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: 16,
    },
    aiPromptText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
    },
    previewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    previewContent: {
        alignItems: 'center',
    },
    previewImage: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.7,
        borderRadius: 8,
    },
    previewClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    previewImageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});