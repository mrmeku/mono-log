import * as Device from 'expo-device';
import { Button, Card, Chip } from 'heroui-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

import { AnimatedIcon } from '@/components/animated-icon';
import { WebBadge } from '@/components/web-badge';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return 'use browser devtools';
  }
  if (Device.isDevice) {
    return 'shake device or press m in terminal';
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return `press ${shortcut}`;
}

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center flex-row bg-background">
      <SafeAreaView className="flex-1 items-center gap-4 px-6 pb-24 max-w-xl">
        <View className="items-center justify-center flex-1 px-6 gap-6">
          <AnimatedIcon />
          <Text className="text-5xl font-semibold text-center text-foreground">
            Welcome to{'\u00A0'}Expo
          </Text>
        </View>

        <Chip variant="secondary" size="sm">
          <Chip.Label className="uppercase">get started</Chip.Label>
        </Chip>

        <Card variant="secondary" className="self-stretch">
          <Card.Body className="gap-4">
            <View className="flex-row justify-between items-center">
              <Card.Title>Try editing</Card.Title>
              <Chip variant="tertiary" size="sm">src/app/index.tsx</Chip>
            </View>
            <View className="flex-row justify-between items-center">
              <Card.Title>Dev tools</Card.Title>
              <Card.Description>{getDevMenuHint()}</Card.Description>
            </View>
            <View className="flex-row justify-between items-center">
              <Card.Title>Fresh start</Card.Title>
              <Chip variant="tertiary" size="sm">npm run reset-project</Chip>
            </View>
          </Card.Body>
        </Card>

        <Button
          variant="primary"
          size="lg"
          className="self-stretch"
          onPress={() => console.log('Get started!')}
        >
          Get Started
        </Button>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </View>
  );
}
