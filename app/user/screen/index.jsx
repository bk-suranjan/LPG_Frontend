import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCylinders();
  }, []);

  const fetchCylinders = async () => {
    try {
      setError(null);
      const res = await api.get('/cylinder');

      if (!res?.data?.cylinders) {
        setCylinders([]);
        return;
      }

      setCylinders(res.data.cylinders);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load cylinders';
      setError(message);
      setCylinders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCylinders();
  }, []);

  const getStockColor = (stock) => {
    if (!stock || stock === 0) return COLORS.error;
    if (stock < 5) return COLORS.warning;
    return COLORS.success;
  };

  const getStockLabel = (stock) => {
    if (!stock || stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
  };

  const renderCylinder = ({ item, index }) => {
    if (!item) return null;

    const stockColor = getStockColor(item.stock);

    return (
      <TouchableOpacity
        onPress={() => router.push(`user/subScreen/${item._id}`)}
        style={[styles.card, index === 0 && { marginTop: SPACING.sm }]}
        activeOpacity={0.7}
      >
        {/* Cylinder Icon */}
        <View style={styles.cardIconContainer}>
          <View style={styles.cardIcon}>
            <Ionicons name="flame" size={28} color={COLORS.accent} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.cardContent}>
          <Text style={styles.cardType}>{item.type || 'Unknown Type'}</Text>
          <Text style={styles.cardPrice}>
            Rs. {item.price != null ? item.price : '—'}
          </Text>
        </View>

        {/* Stock Badge */}
        <View style={styles.cardRight}>
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: `${stockColor}18` },
            ]}
          >
            <View
              style={[styles.stockDot, { backgroundColor: stockColor }]}
            />
            <Text style={[styles.stockText, { color: stockColor }]}>
              {getStockLabel(item.stock)}
            </Text>
          </View>
          <Text style={styles.stockCount}>
            {item.stock != null ? item.stock : 0} units
          </Text>
        </View>

        {/* Arrow */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textMuted}
          style={{ marginLeft: SPACING.sm }}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading cylinders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome back 👋</Text>
          <Text style={styles.headerTitle}>Available Cylinders</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {cylinders?.length || 0}
          </Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchCylinders}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List */}
      <FlatList
        data={cylinders}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        renderItem={renderCylinder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cube-outline"
                size={64}
                color={COLORS.textMuted}
              />
              <Text style={styles.emptyTitle}>No Cylinders Available</Text>
              <Text style={styles.emptySubtitle}>
                Pull down to refresh
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerGreeting: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  headerBadge: {
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  headerBadgeText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    flex: 1,
  },
  retryText: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.small,
  },
  cardIconContainer: {
    marginRight: SPACING.md,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardType: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardPrice: {
    fontSize: FONTS.sizes.md,
    color: COLORS.accent,
    fontWeight: FONTS.weights.semibold,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginRight: SPACING.xs,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  stockCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
});