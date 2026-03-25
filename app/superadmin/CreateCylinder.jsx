import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CreateCylinder = () => {
  const [cylinderType, setCylinderType] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Focus states
  const [stockFocused, setStockFocused] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);

  const router = useRouter();

  const cylinderOptions = ['5kg', '10kg', '15kg'];

  const handleCreateCylinder = async () => {
    // Validate inputs
    if (!cylinderType) {
      setError('Please select a cylinder type');
      return;
    }
    if (!stock || isNaN(Number(stock))) {
      setError('Please enter a valid stock quantity');
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError('Please enter a valid price');
      return;
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please login again.');
        return;
      }

      const res = await api.post(
        '/cylinder',
        {
          type: cylinderType,
          stock: Number(stock),
          price: Number(price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res?.data) {
        throw new Error('Invalid response from server');
      }

      setSuccess(true);
      setCylinderType('');
      setStock('');
      setPrice('');
      
      Alert.alert(
        "Success", 
        "Cylinder created successfully!",
        [{ text: "OK", onPress: () => router.push('/superadmin') }]
      );
      
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create cylinder. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="add-circle" size={32} color={COLORS.accent} />
          </View>
          <Text style={styles.headerTitle}>Create Cylinder</Text>
          <Text style={styles.headerSubtitle}>
            Add a new cylinder type to the inventory
          </Text>
        </View>

        {/* Success Message */}
        {success ? (
          <View style={styles.successContainer}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.success}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>Created Successfully! ✅</Text>
              <Text style={styles.successText}>
                The new cylinder has been added to your inventory.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Card */}
        <View style={styles.card}>
          {/* Cylinder Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cylinder Type</Text>
            <View style={styles.chipRow}>
              {cylinderOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.chip,
                    cylinderType === opt && styles.chipSelected,
                  ]}
                  onPress={() => {
                    setCylinderType(opt);
                    if (error) setError(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="flame"
                    size={16}
                    color={
                      cylinderType === opt ? COLORS.textPrimary : COLORS.accent
                    }
                  />
                  <Text
                    style={[
                      styles.chipText,
                      cylinderType === opt && styles.chipTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Initial Stock */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Initial Stock</Text>
            <View
              style={[
                styles.inputWrapper,
                stockFocused && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="layers-outline"
                size={20}
                color={stockFocused ? COLORS.accent : COLORS.textMuted}
              />
              <TextInput
                value={stock}
                onChangeText={(text) => {
                  setStock(text.replace(/[^0-9]/g, ''));
                  if (error) setError(null);
                }}
                placeholder="Enter stock quantity"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                keyboardType="numeric"
                onFocus={() => setStockFocused(true)}
                onBlur={() => setStockFocused(false)}
              />
            </View>
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (Rs.)</Text>
            <View
              style={[
                styles.inputWrapper,
                priceFocused && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="cash-outline"
                size={20}
                color={priceFocused ? COLORS.accent : COLORS.textMuted}
              />
              <TextInput
                value={price}
                onChangeText={(text) => {
                  setPrice(text.replace(/[^0-9]/g, ''));
                  if (error) setError(null);
                }}
                placeholder="Enter price per cylinder"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
                keyboardType="numeric"
                onFocus={() => setPriceFocused(true)}
                onBlur={() => setPriceFocused(false)}
              />
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleCreateCylinder}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} size="small" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={22} color={COLORS.textPrimary} />
                <Text style={styles.submitButtonText}>Create Cylinder</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateCylinder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.glow,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  successTitle: {
    color: COLORS.success,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  successText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.medium,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.inputBg,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    ...SHADOWS.glow,
  },
  chipText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputBorderFocused,
    backgroundColor: 'rgba(255, 107, 53, 0.04)',
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    ...SHADOWS.glow,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },
});