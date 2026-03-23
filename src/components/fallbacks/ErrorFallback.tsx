import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { AlertTriangle, RotateCcw } from 'lucide-react-native';
import React from 'react';
import { Text, useColorScheme, View } from 'react-native';

interface IErrorFallbackProps {
    resetErrorBoundary: (...args: unknown[]) => void;
}

const ErrorFallback = ({ resetErrorBoundary }: IErrorFallbackProps) => {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212] p-6">
            <View className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 w-full max-w-sm shadow-2xl items-center">
                <View className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-full items-center justify-center mb-6">
                    <AlertTriangle size={40} color="#ef4444" />
                </View>

                <Text
                    style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                    className="text-4xl text-[#1a1a1a] dark:text-[#f3f4f6] text-center mb-3"
                >
                    Opps!...
                </Text>

                <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-[#64748b] dark:text-[#9ca3af] text-center text-sm leading-6 mb-10 px-2"
                >
                    Hubo un problema inesperado en la solicitud. ¿Te gustaría intentar de nuevo?
                </Text>

                <View className="w-full gap-4">
                    <AnimatedPressable
                        onPress={() => resetErrorBoundary()}
                        className="bg-black dark:bg-white h-14 rounded-2xl flex-row items-center justify-center active:opacity-90"
                    >
                        <RotateCcw size={18} color={colorScheme === 'dark' ? '#000' : '#fff'} strokeWidth={2} />
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-base ml-2">
                            Intentar de nuevo
                        </Text>
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    );
};

export default ErrorFallback;