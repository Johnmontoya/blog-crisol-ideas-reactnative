import { StyleSheet, Text, View } from "react-native";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function AdminDashboardPage() {
    return (
        <View style={styles.container}>
            <DashboardNavbar title="Admin Panel" />
            <View style={styles.content}>
                <Text style={styles.text}>Admin Dashboard</Text>
                <Text style={styles.subtext}>Gestiona los usuarios y el contenido aquí.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    subtext: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 10,
        textAlign: 'center',
    }
});