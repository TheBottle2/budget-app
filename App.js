import React from 'react';
import { NavigationContainer }        from '@react-navigation/native';
import { createStackNavigator }       from '@react-navigation/stack';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth }      from './src/context/AuthContext';

import LoginScreen    from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen     from './src/screens/HomeScreen';
import HistoryScreen  from './src/screens/HistoryScreen';
import ReportScreen   from './src/screens/ReportScreen';
import AddEditScreen  from './src/screens/AddEditScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

const HEADER = {
  headerStyle:      { backgroundColor: '#6C63FF' },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="HomeMain"  component={HomeScreen}    options={{ headerShown: false }} />
      <Stack.Screen name="AddEdit"   component={AddEditScreen} options={({ route }) => ({
        title: route.params?.islem ? 'İşlemi Düzenle' : 'Yeni İşlem',
      })} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={HEADER}>
      <Stack.Screen name="HistoryMain" component={HistoryScreen}  options={{ title: 'Tüm İşlemler' }} />
      <Stack.Screen name="AddEdit"     component={AddEditScreen}  options={({ route }) => ({
        title: route.params?.islem ? 'İşlemi Düzenle' : 'Yeni İşlem',
      })} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:   '#6C63FF',
      tabBarInactiveTintColor: '#999',
      tabBarStyle:             { backgroundColor: '#fff', borderTopWidth: 0, elevation: 10, height: 60, paddingBottom: 8 },
      tabBarLabelStyle:        { fontSize: 12, fontWeight: '600' },
    }}>
      <Tab.Screen name="Home"    component={HomeStack}    options={{ title: 'Ana Sayfa', tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ title: 'Geçmiş',   tabBarIcon: () => <Text style={{ fontSize: 22 }}>📋</Text> }} />
      <Tab.Screen name="Report"  component={ReportScreen} options={{ title: 'Rapor',    tabBarIcon: () => <Text style={{ fontSize: 22 }}>📊</Text> }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { kullanici, yukleniyor } = useAuth();

  if (yukleniyor) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#6C63FF" /></View>;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {kullanici ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}