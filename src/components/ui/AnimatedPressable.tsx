import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | any;
  scaleTo?: number;
}

export default function AnimatedPressable({
  children,
  style,
  scaleTo = 0.95,
  onPressIn,
  onPressOut,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (e: any) => {
    scale.value = withSpring(scaleTo, {
      mass: 0.5,
      damping: 15,
      stiffness: 150,
      overshootClamping: false,
    });
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, {
      mass: 0.5,
      damping: 15,
      stiffness: 150,
      overshootClamping: false,
    });
    if (onPressOut) onPressOut(e);
  };

  return (
    <AnimatedPressableComponent
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressableComponent>
  );
}
