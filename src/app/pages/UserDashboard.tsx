import { Text, View, StyleSheet } from "react-native";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function UserDashboard() {
    return (
        <View style={styles.container}>
            <DashboardNavbar title="User Panel" />
            <View style={styles.content}>
                <Text style={styles.text}>User Dashboard</Text>
                <Text style={styles.subtext}>Bienvenido a tu panel de control</Text>
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
    }
});
