import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Project = {
  id: string;
  name: string;
  address?: string;
  updated?: string;
};

const SAMPLE_PROJECTS: Project[] = [
  { id: '1', name: '123 Main St Remodel', address: 'Denver, CO', updated: '2 days ago' },
  { id: '2', name: 'Riverside Apartments', address: 'Chicago, IL', updated: '5 days ago' },
  { id: '3', name: 'Bridge Repair', address: 'Seattle, WA', updated: '1 week ago' },
];

export default function Index() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [BarcodeModule, setBarcodeModule] = useState<any | null>(null);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAddress, setNewProjectAddress] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setMenuOpen(false);
    }, [])
  );

  async function openScanner() {
    try {
      // dynamically import only when user requests scanner
      // add a timeout to avoid hanging if native module import stalls
      const importPromise = import('expo-barcode-scanner');
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('import-timeout')), 6000));
      const mod = (await Promise.race([importPromise, timeout])) as any;

      // If the JS module loaded but native binding is missing, bail out with a clear state
      if (!mod || !mod.BarCodeScanner || typeof mod.BarCodeScanner.requestPermissionsAsync !== 'function') {
        console.warn('Barcode scanner JS module loaded but native binding is missing');
        setBarcodeModule(null);
        setHasPermission(false);
        setScannerOpen(true);
        return;
      }

      setBarcodeModule(mod);
      const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      setScannerOpen(true);
    } catch (e) {
      console.warn('Barcode scanner module not available or import timed out', e);
      setBarcodeModule(null);
      setHasPermission(false);
      setScannerOpen(true);
    }
  }

  const projectsFiltered = useMemo(() => {
    if (!query) return projects;
    const q = query.toLowerCase();
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.address || '').toLowerCase().includes(q)
    );
  }, [query, projects]);

  function renderProject({ item }: { item: Project }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          router.push({
            pathname: '/project/[id]',
            params: { id: item.id, name: item.name },
          });
        }}
        onLongPress={() => {
          setSelectedProject(item);
          setDeleteModalOpen(true);
        }}
      >
        <View style={styles.cardLeft} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>{item.updated}</Text>
          <MaterialIcons name="chevron-right" size={22} color="#9aa0a6" />
        </View>
      </TouchableOpacity>
    );
  }

  const Scanner: any = BarcodeModule ? BarcodeModule.BarCodeScanner : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {searchOpen ? (
          <>
            <TouchableOpacity onPress={() => { setSearchOpen(false); setQuery(''); }} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TextInput
              autoFocus
              placeholder="Search projects"
              placeholderTextColor="#7a7f83"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInputInHeader}
            />
            <TouchableOpacity style={styles.qrBtn} onPress={() => { }}>
              <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Text style={styles.brand}>CROWSNEST</Text>
              <Text style={styles.by}>BY</Text>
              <Text style={styles.owner}>P&R TECH</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconBtn}>
                <MaterialIcons name="notifications-none" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchOpen(true)}>
                <Ionicons name="search" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuOpen((s) => !s)}>
                <MaterialIcons name="more-vert" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {menuOpen && (
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/profile')
              }
            >
              <MaterialIcons name="person" size={18} color="#fff" />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/data')}
            >
              <MaterialIcons name="cloud" size={18} color="#fff" />
              <Text style={styles.menuItemText}>Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/support')}
            >
              <MaterialIcons name="support-agent" size={18} color="#fff" />
              <Text style={styles.menuItemText}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
            >
              <MaterialIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.menuItemText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                console.log('Sign out');
              }}
            >
              <MaterialIcons name="logout" size={18} color="#fff" />
              <Text style={styles.menuItemText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      <Modal visible={scannerOpen} animationType="slide" transparent>
        <View style={styles.scannerOverlay}>
          {hasPermission === null ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : hasPermission === false ? (
            <View style={styles.scannerFallback}>
              <Text style={{ color: '#fff', marginBottom: 12 }}>
                {BarcodeModule ? 'Camera permission denied' : 'Scanner module not available. Install expo-barcode-scanner or rebuild the app.'}
              </Text>
              <TouchableOpacity onPress={() => setScannerOpen(false)} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Scanner ? (
              <Scanner
                onBarCodeScanned={(data: any) => {
                  if (scanning) return;
                  setScanning(true);
                  setQuery(String(data.data || data));
                  setScannerOpen(false);
                  setScanning(false);
                  setSearchOpen(false);
                }}
                style={StyleSheet.absoluteFillObject}
              />
            ) : (
              <View style={StyleSheet.absoluteFillObject} />
            )
          )}
        </View>
      </Modal>

      <Modal visible={createProjectOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Project Name"
              placeholderTextColor="#7a7f83"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Project Code (optional)"
              placeholderTextColor="#7a7f83"
              value={newProjectAddress}
              onChangeText={setNewProjectAddress}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setCreateProjectOpen(false);
                  setNewProjectName('');
                  setNewProjectAddress('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (newProjectName.trim()) {
                    setProjects(prev => [...prev, {
                      id: Date.now().toString(),
                      name: newProjectName.trim(),
                      address: newProjectAddress.trim() || undefined,
                      updated: 'Just now'
                    }]);
                    setCreateProjectOpen(false);
                    setNewProjectName('');
                    setNewProjectAddress('');
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Project</Text>
            <Text style={styles.modalText}>Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setDeleteModalOpen(false);
                  setSelectedProject(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#8B0000' }]}
                onPress={() => {
                  if (selectedProject) {
                    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
                  }
                  setDeleteModalOpen(false);
                  setSelectedProject(null);
                }}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROJECTS ON DEVICE</Text>
        <Text style={styles.sectionCount}>{projects.length}</Text>
      </View>

      <FlatList
        data={projectsFiltered}
        keyExtractor={(i) => i.id}
        renderItem={renderProject}
        contentContainerStyle={styles.list}
        ListFooterComponent={() => (
          <View>
            <View style={styles.otherContainer}>
              <Text style={styles.otherTitle}>OTHER PROJECTS</Text>
            </View>

            <TouchableOpacity
              style={styles.templateCard}
              activeOpacity={0.8}
              onPress={() => {
                console.log('Create project from template');
              }}
            >
              <View style={styles.templateLeft} />
              <View style={styles.templateContent}>
                <Text style={styles.templateTitle}>Sample Project - SPR</Text>
                <Text style={styles.templateSubtitle}>Create a new project from this template</Text>
              </View>
              <MaterialIcons name="add" size={22} color="#8B0000" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => setCreateProjectOpen(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121417',
    borderBottomWidth: 1,
    borderBottomColor: '#151515',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
  by: {
    color: '#9aa0a6',
    fontSize: 10,
    marginRight: 6,
  },
  owner: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: '#8B0000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 12,
  },
  searchRow: {
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#161717',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#fff',
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: 18,
    height: 20,
    textAlignVertical: 'center',
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
  filterBtn: {
    marginLeft: 8,
    padding: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#9aa0a6',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCount: { color: '#7a7f83', fontSize: 12 },
  otherContainer: {
    paddingLeft: 4,
    paddingRight: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  otherTitle: {
    color: '#9aa0a6',
    fontSize: 12,
    fontWeight: '700',
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1112',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 0,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2b2b2b',
    borderStyle: 'dashed',
    alignSelf: 'stretch',
  },
  templateLeft: {
    width: 6,
    height: '100%',
    backgroundColor: '#8B0000',
    borderRadius: 3,
    marginRight: 12,
  },
  templateContent: {
    flex: 1,
  },
  templateTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  templateSubtitle: {
    color: '#8b9094',
    fontSize: 12,
  },
  qrBtn: {
    marginLeft: 8,
    padding: 6,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  menuBox: {
    position: 'absolute',
    top: 56,
    right: 12,
    width: 180,
    backgroundColor: '#141616',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    elevation: 20,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },

  list: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141616',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardLeft: {
    width: 6,
    height: '100%',
    backgroundColor: '#8B0000',
    borderRadius: 3,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#8b9094',
    fontSize: 12,
  },
  cardMeta: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  cardMetaText: {
    color: '#7a7f83',
    fontSize: 11,
    marginBottom: 6,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#141616',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    color: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#121417',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});