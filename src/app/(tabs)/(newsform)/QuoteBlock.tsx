import React from 'react';
import { Text, TextInput, View } from 'react-native';

export default function QuoteBlock({ quoteText, setQuoteText, context, setContext, colorScheme }: any) {
    const isDark = colorScheme === 'dark';

    return (
        <View className="p-6 gap-6 bg-[#fdfdfc] dark:bg-[#121212] flex-1">
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Texto de la Cita</Text>
                <TextInput
                    value={quoteText}
                    onChangeText={setQuoteText}
                    multiline
                    placeholder="La frase que aparecerá destacada..."
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] min-h-[120px]"
                />
            </View>
            <View>
                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Autor de la frase</Text>
                <TextInput
                    value={context}
                    onChangeText={setContext}
                    placeholder="Nombre del autor o fuente"
                    placeholderTextColor="#94a3b8"
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                />
            </View>
        </View>
    );
}