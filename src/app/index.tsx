import { Button, Card, Chip } from 'heroui-native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 items-center justify-center gap-6 px-6">
        <Text className="text-3xl font-bold text-foreground">HeroUI Native</Text>
        <Text className="text-base text-default-500">Verify integration is working</Text>

        <Card variant="secondary" className="self-stretch">
          <Card.Body className="gap-3">
            <Card.Title>Setup Checklist</Card.Title>
            <View className="flex-row flex-wrap gap-2">
              <Chip variant="primary" size="sm"><Chip.Label>Uniwind</Chip.Label></Chip>
              <Chip variant="secondary" size="sm"><Chip.Label>Tailwind</Chip.Label></Chip>
              <Chip variant="tertiary" size="sm"><Chip.Label>HeroUI</Chip.Label></Chip>
            </View>
          </Card.Body>
        </Card>

        <View className="self-stretch gap-3">
          <Button variant="primary" onPress={() => console.log('primary')}>Primary Button</Button>
          <Button variant="secondary" onPress={() => console.log('secondary')}>Secondary Button</Button>
          <Button variant="tertiary" onPress={() => console.log('tertiary')}>Tertiary Button</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
