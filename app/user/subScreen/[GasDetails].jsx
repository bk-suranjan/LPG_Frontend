import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../utils/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const GasDetails = () => {
  const { GasDetails: id } = useLocalSearchParams();
  const router = useRouter();
  const [cylinder, setCylinder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCylinderDetails();
    } else {
      setError('Invalid cylinder ID');
      setLoading(false);
    }
  }, [id]);

  const fetchCylinderDetails = async () => {
    try {
      setError(null);
      const res = await api.get(`/cylinder/${id}`);

      if (!res?.data?.cylinder && !res?.data) {
        throw new Error('Cylinder not found');
      }

      setCylinder(res.data.cylinder || res.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load cylinder details';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (stock) => {
    if (!stock || stock === 0) return COLORS.error;
    if (stock < 5) return COLORS.warning;
    return COLORS.success;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCylinderDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cylinder) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.errorTitle}>Cylinder not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Ionicons name="flame" size={48} color={COLORS.accent} />
        </View>
        <Text style={styles.heroTitle}>{cylinder.type || 'Gas Cylinder'}</Text>
        <Text style={styles.heroPrice}>
          Rs. {cylinder.price != null ? cylinder.price : '—'}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cylinder Details</Text>

        <InfoRow
          icon="pricetag-outline"
          label="Type"
          value={cylinder.type || '—'}
        />
        <View style={styles.divider} />

        <InfoRow
          icon="cash-outline"
          label="Price"
          value={`Rs. ${cylinder.price != null ? cylinder.price : '—'}`}
        />
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="layers-outline" size={20} color={COLORS.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Stock</Text>
            <Text
              style={[
                styles.infoValue,
                { color: getStockColor(cylinder.stock) },
              ]}
            >
              {cylinder.stock != null ? `${cylinder.stock} units` : '—'}
            </Text>
          </View>
        </View>

        {cylinder.description ? (
          <>
            <View style={styles.divider} />
            <InfoRow
              icon="document-text-outline"
              label="Description"
              value={cylinder.description}
            />
          </>
        ) : null}

        {cylinder.weight ? (
          <>
            <View style={styles.divider} />
            <InfoRow
              icon="fitness-outline"
              label="Weight"
              value={cylinder.weight}
            />
          </>
        ) : null}
      </View>

      {/* Book CTA */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push('/user/screen/Book')}
        activeOpacity={0.8}
      >
        <Ionicons name="cart" size={22} color={COLORS.textPrimary} />
        <Text style={styles.bookButtonText}>Book This Cylinder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <Ionicons name={icon} size={20} color={COLORS.accent} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default GasDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  errorTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  retryText: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: SPACING.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.glow,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  heroPrice: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.accent,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: SPACING.xxl,
    ...SHADOWS.medium,
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.glow,
  },
  bookButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },
});