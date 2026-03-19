import { useVerifyMutation } from '@/queries/mutation/userMutation';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function VerifyPage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const verifyMutation = useVerifyMutation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    // Only allow one digit
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (error) setError(null);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }

    if (!userId) {
      setError('ID de usuario no encontrado. Reintenta el registro.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await verifyMutation.mutateAsync({ 
        userId: userId, 
        otp: otpString 
      }, {
        onSuccess: () => {
          router.replace('/(auth)/login');
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'El código ingresado es incorrecto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      // Logic for resending OTP would go here
    }
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white/10 rounded-[32px] border border-white/10 py-10 px-6 backdrop-blur-md">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/50 justify-center items-center mb-4">
              <Text className="text-3xl text-violet-400">✦</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-100 tracking-tight text-center">
              Verifica tu cuenta
            </Text>
            <Text className="text-sm text-gray-400 mt-2 text-center px-4">
              Ingresa el código de 6 dígitos enviado a tu correo electrónico.
            </Text>
          </View>

          {/* OTP Input Boxes */}
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className={`w-12 h-14 bg-white/5 border ${
                  digit ? 'border-violet-500 text-violet-300' : 'border-white/10 text-gray-400'
                } rounded-xl text-center text-xl font-bold`}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {error && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
              <Text className="text-red-300 text-xs text-center">{error}</Text>
            </View>
          )}

          <Pressable
            onPress={handleVerify}
            disabled={isSubmitting}
            className={`bg-violet-600 rounded-2xl py-4 items-center active:opacity-80 active:scale-[0.98] ${
              isSubmitting ? 'opacity-70' : 'opacity-100'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base tracking-wide">Verificar código</Text>
            )}
          </Pressable>

          {/* Footer / Resend */}
          <View className="items-center mt-8">
            <Text className="text-sm text-gray-400 mb-1">
              ¿No recibiste el código?
            </Text>
            <Pressable 
              onPress={handleResend}
              disabled={resendTimer > 0}
            >
              <Text className={`text-sm font-bold ${resendTimer > 0 ? 'text-gray-500' : 'text-violet-400'}`}>
                {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : 'Reenviar código ahora'}
              </Text>
            </Pressable>
          </View>

          <Pressable 
            onPress={() => router.back()}
            className="mt-6 flex-row justify-center"
          >
            <Text className="text-xs text-gray-400 italic">O bien, vuelve atrás</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}