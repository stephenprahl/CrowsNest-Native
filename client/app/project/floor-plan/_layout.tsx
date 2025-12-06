import { Stack } from 'expo-router';

export default function FloorPlanLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    );
}