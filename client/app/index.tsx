import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.title}>BIZNITS</Text>
        <Text style={styles.span}>BY</Text>
        <Text style={styles.subtitle}>STEVIE</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.icon}>
            <MaterialIcons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <MaterialIcons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Text style={styles.iconText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Main content */}
      <View style={styles.main}>
        <Text style={styles.projectsTop}>PROJECTS ON DEVICE</Text>
      <View style={styles.sub}>
        <Text style={styles.projectsBottom}>OTHER PROJECTS</Text>
      </View>
      </View>
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2d2c2cff',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  span: {
    fontSize: 10,
    color: '#ccc',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    borderWidth: 1,
    paddingHorizontal: 3,
    borderColor: '#8B0000',
    borderRadius: 1,
    backgroundColor: ''
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15, // Space between icons
  },
  iconText: {
    fontSize: 24,
    color: '#fff',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Position to the left
    backgroundColor: '#161616ff',
    paddingLeft: 10, // Optional padding for better alignment,
  },
  sub: {
    flex: 1,
  },
  projectsTop: {
    color: '#fff',
  },
  projectsBottom: {
    color: '#fff',
  },
  floatingButtonContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24
  }
})