import React from 'react';
import { Text, TextInput, View } from 'react-native';

export default function BulletList({ points, setPoints, author, setAuthor, colorScheme }: any) {
    const isDark = colorScheme === 'dark';

    return (
        <View className="p-6 gap-6 bg-[#fdfdfc] dark:bg-[#121212] flex-1">
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Puntos clave</Text>
                <TextInput
                    value={points}
                    onChangeText={setPoints}
                    multiline
                    placeholder="Punto 1, Punto 2, Punto 3..."
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] min-h-[150px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Editor responsable</Text>
                <TextInput
                    value={author}
                    onChangeText={setAuthor}
                    placeholder="Nombre del editor o autor"
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                />
            </View>
        </View>
    );
}
