import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Person = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
};

export default function PeopleScreen() {
    const router = useRouter();
    const [inviteSearchOpen, setInviteSearchOpen] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [people, setPeople] = useState<Person[]>([]);
    const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
    const [contactsModalVisible, setContactsModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const inviteByEmail = () => {
        if (inviteEmail.trim()) {
            const newPerson: Person = {
                id: Date.now().toString(),
                name: inviteEmail,
                email: inviteEmail,
            };
            setPeople(prev => [...prev, newPerson]);
            setInviteEmail('');
            setInviteSearchOpen(false);
        }
    };

    const loadContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
            });
            setContacts(data);
            setContactsModalVisible(true);
            setInviteSearchOpen(false);
        }
    };

    const inviteContact = (contact: Contacts.Contact) => {
        const email = contact.emails?.[0]?.email;
        const phone = contact.phoneNumbers?.[0]?.number;
        const newPerson: Person = {
            id: Date.now().toString(),
            name: contact.name,
            email,
            phone,
        };
        setPeople(prev => [...prev, newPerson]);
        setContactsModalVisible(false);
    };

    if (inviteSearchOpen) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { setInviteSearchOpen(false); setInviteEmail(''); }} style={styles.iconBtn}>
                        <MaterialIcons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TextInput
                        autoFocus
                        placeholder="Enter email address to invite"
                        placeholderTextColor="#7a7f83"
                        value={inviteEmail}
                        onChangeText={setInviteEmail}
                        style={styles.searchInputInHeader}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={inviteByEmail} style={styles.iconBtn}>
                        <MaterialIcons name="send" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.inviteContainer}>
                    <Text style={styles.deviceContactsText}>Device contacts</Text>
                    <TouchableOpacity style={styles.connectContactsButton} onPress={loadContacts}>
                        <MaterialCommunityIcons name="contacts" size={24} color="#8B0000" />
                        <Text style={styles.connectContactsText}>CONNECT TO DEVICE CONTACTS</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite via email</Text>
                <View style={styles.headerRight}>
                    <View style={[styles.iconBtn, { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }]}>
                        <MaterialIcons name="send" size={22} color="#8B0000" />
                    </View>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.peopleContainer}>
                <ScrollView style={styles.peopleScrollView} contentContainerStyle={styles.peopleContent}>
                    {people.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="account-group-outline" size={60} color="#8B0000" />
                            <Text style={styles.contentTitle}>No team members yet</Text>
                            <Text style={styles.contentSubtitle}>Invite people to collaborate on this project</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Team Members</Text>
                            <View style={styles.peopleList}>
                                {people.map((person) => (
                                    <TouchableOpacity
                                        key={person.id}
                                        style={styles.personItemContainer}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setSelectedPerson(person);
                                            setProfileModalVisible(true);
                                        }}
                                    >
                                        <View style={styles.personItem}>
                                            <MaterialCommunityIcons name="account-circle" size={40} color="#8B0000" />
                                            <View style={styles.personInfo}>
                                                <Text style={styles.personName}>{person.name}</Text>
                                                {person.email && <Text style={styles.personDetail}>{person.email}</Text>}
                                                {person.phone && <Text style={styles.personDetail}>{person.phone}</Text>}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </ScrollView>
                <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => setInviteSearchOpen(true)}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Modal */}
            {profileModalVisible && selectedPerson && (
                <View style={styles.modalOverlay}>
                    <View style={styles.profileModalContent}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <MaterialCommunityIcons name="account-circle" size={80} color="#8B0000" />
                            </View>
                            <Text style={styles.profileName}>{selectedPerson.name}</Text>
                            <Text style={styles.profileRole}>Team Member</Text>
                        </View>
                        <View style={styles.profileDetails}>
                            {selectedPerson.email && (
                                <View style={styles.profileDetailRow}>
                                    <MaterialCommunityIcons name="email-outline" size={24} color="#9aa0a6" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Email</Text>
                                        <Text style={styles.profileDetailText}>{selectedPerson.email}</Text>
                                    </View>
                                </View>
                            )}
                            {selectedPerson.phone && (
                                <View style={styles.profileDetailRow}>
                                    <MaterialCommunityIcons name="phone-outline" size={24} color="#9aa0a6" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Phone</Text>
                                        <Text style={styles.profileDetailText}>{selectedPerson.phone}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setProfileModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Contacts Modal */}
            {contactsModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.contactsModalContent}>
                        <Text style={styles.modalTitle}>Select Contact</Text>
                        <View style={styles.contactsList}>
                            {contacts.slice(0, 10).map((contact) => (
                                <TouchableOpacity
                                    key={contact.name}
                                    style={styles.contactItem}
                                    onPress={() => inviteContact(contact)}
                                >
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    {contact.emails && contact.emails.length > 0 && (
                                        <Text style={styles.contactDetail}>{contact.emails[0].email}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setContactsModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    headerTitle: {
        flex: 1,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 12,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInputInHeader: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        marginHorizontal: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    connectContactsText: {
        color: '#8B0000',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    contentTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
    },
    contentSubtitle: {
        color: '#9aa0a6',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    peopleList: {
        marginTop: 10,
    },
    personItemContainer: {
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    personItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileModalContent: {
        backgroundColor: '#121417',
        borderRadius: 16,
        width: '85%',
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1f1f1f',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#8B0000',
    },
    profileName: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileRole: {
        color: '#9aa0a6',
        fontSize: 16,
        fontWeight: '500',
    },
    profileDetails: {
        width: '100%',
        marginBottom: 24,
    },
    profileDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    detailTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    detailLabel: {
        color: '#9aa0a6',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    profileDetailText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    profileModalContent: {
        backgroundColor: '#121417',
        borderRadius: 16,
        width: '85%',
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1f1f1f',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#8B0000',
    },
    profileName: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileRole: {
        color: '#9aa0a6',
        fontSize: 16,
        fontWeight: '500',
    },
    profileDetails: {
        width: '100%',
        marginBottom: 24,
    },
    profileDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    detailTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    detailLabel: {
        color: '#9aa0a6',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    profileDetailText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#8B0000',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    contactsList: {
        maxHeight: 300,
    },
    contactItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    contactName: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },
    contactDetail: {
        color: '#9aa0a6',
        fontSize: 14,
        marginTop: 2,
    },
    cancelButton: {
        backgroundColor: '#666',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});