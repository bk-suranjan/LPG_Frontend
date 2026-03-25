import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS, FONTS } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const SuperAdminLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.primaryDark,
                    borderTopColor: COLORS.surfaceBorder,
                    borderTopWidth: 1,
                    height: 70,
                },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: {
                    fontSize: FONTS.sizes.xs,
                    fontWeight: FONTS.weights.medium,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="speedometer-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="CreateCylinder"
                options={{
                    title: 'Create Cylinder',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default SuperAdminLayout;