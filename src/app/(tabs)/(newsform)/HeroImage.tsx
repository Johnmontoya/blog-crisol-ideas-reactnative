import React from 'react';
import { Text, TextInput, View } from 'react-native';

export default function HeroImage({ imageUrl, setImageUrl, description, setDescription, colorScheme }: any) {
    const isDark = colorScheme === 'dark';

    return (
        <View className="p-6 gap-6 bg-[#fdfdfc] dark:bg-[#121212] flex-1">
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">URL de la Imagen</Text>
                <TextInput
                    value={imageUrl}
                    onChangeText={setImageUrl}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Contexto / Pie de foto</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    placeholder="Describa brevemente la noticia..."
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] min-h-[120px]"
                />
            </View>
        </View>
    );
}