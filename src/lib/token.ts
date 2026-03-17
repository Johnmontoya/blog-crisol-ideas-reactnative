import AsyncStorage from '@react-native-async-storage/async-storage';

class Token {
    /**
     * Get token from storage.
     * Note: This is now ASYNC because of AsyncStorage.
     */
    public async getToken(key: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    }

    /**
     * Set token in storage.
     */
    public async setToken(key: string, token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, token);
        } catch (error) {
            console.error("Error setting token:", error);
        }
    }

    /**
     * Remove token from storage.
     */
    public async removeToken(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing token:", error);
        }
    }
}

export default new Token();