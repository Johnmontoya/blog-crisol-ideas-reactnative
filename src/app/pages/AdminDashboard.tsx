import MyTabsAdmin from "@/components/TabsMenuAdmin";
import { StyleSheet, View } from "react-native";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function AdminDashboardPage() {
    return (
        <View style={styles.container}>
            <DashboardNavbar title="Admin Panel" />
            <MyTabsAdmin />
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