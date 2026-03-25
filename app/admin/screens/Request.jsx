import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../utils/api';
import { useRouter } from 'expo-router';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  getStatusColor,
  getStatusBg,
} from '../../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const Request = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      const res = await api.get('/booking/list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res?.data?.bookings) {
        setBookings([]);
        return;
      }

      setBookings(res.data.bookings);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load bookings';
      setError(message);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, []);

  const renderItem = ({ item }) => {
    if (!item) return null;

    const statusColor = getStatusColor(item.status);
    const statusBg = getStatusBg(item.status);

    return (
      <TouchableOpacity
        onPress={() => router.push(`admin/subscreens/${item._id}`)}
        style={styles.card}
        activeOpacity={0.7}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon}>
              <Ionicons name="cube" size={20} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.cardType}>
                {item.cylinderType || 'Unknown'}
              </Text>
              <Text style={styles.cardQty}>
                Qty: {item.quantity != null ? item.quantity : '—'}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : '—'}
            </Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.cardRowText} numberOfLines={1}>
              {item.address || 'No address provided'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.cardRowText}>
              {item.bookingDate
                ? new Date(item.bookingDate).toLocaleDateString()
                : '—'}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.cardArrow}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={COLORS.textMuted}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>BOOKING REQUESTS</Text>
          <Text style={styles.headerTitle}>Manage Orders</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {bookings?.length || 0}
          </Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchBookings}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item?._id || Math.random().toString()}
        renderItem={renderItem}
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
                name="document-text-outline"
                size={64}
                color={COLORS.textMuted}
              />
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
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

export default Request;

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
  headerLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  cardQty: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  cardBody: {
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cardRowText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardArrow: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
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