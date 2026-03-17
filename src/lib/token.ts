import storage from './storage';

class Token {
    /**
     * Get token from storage.
     */
    public async getToken(key: string): Promise<string | null> {
        try {
            return await storage.getItem(key);
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
            await storage.setItem(key, token);
        } catch (error) {
            console.error("Error setting token:", error);
        }
    }

    /**
     * Remove token from storage.
     */
    public async removeToken(key: string): Promise<void> {
        try {
            await storage.removeItem(key);
        } catch (error) {
            console.error("Error removing token:", error);
        }
    }
}

export default new Token();