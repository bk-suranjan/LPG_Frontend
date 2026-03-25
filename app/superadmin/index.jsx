import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  getStatusColor,
  getStatusBg,
} from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SuperAdminHome = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/(auth)/Login');
    } catch (err) {
      console.log('Logout failed:', err);
      setLoggingOut(false);
    }
  };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      const res = await api.get('/booking/total', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res?.data?.booking) {
        setBookings([]);
        return;
      }

      setBookings(res.data.booking);
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
    getBookings();
  }, []);

  const renderItem = ({ item }) => {
    if (!item) return null;

    const statusColor = getStatusColor(item.status);
    const statusBg = getStatusBg(item.status);

    return (
      <View style={styles.card}>
        {/* Header */}
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

        {/* Details */}
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.cardRowText}>
              {item.bookingDate
                ? new Date(item.bookingDate).toDateString()
                : '—'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.cardRowText}>
              Admin: {item.assignedAdmin?.fullName || 'Not assigned'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerLabel}>SUPER ADMIN</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {bookings?.length || 0}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            disabled={loggingOut}
            activeOpacity={0.7}
          >
            {loggingOut ? (
              <ActivityIndicator color={COLORS.error} size="small" />
            ) : (
              <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {bookings?.filter((b) => b?.status === 'pending').length || 0}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {bookings?.filter((b) => b?.status === 'delivered').length || 0}
          </Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.info }]}>
            {bookings?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={getBookings}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List */}
      <Text style={styles.sectionTitle}>All Bookings</Text>
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
                name="analytics-outline"
                size={64}
                color={COLORS.textMuted}
              />
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
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

export default SuperAdminHome;

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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    letterSpacing: 1.5,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerBadge: {
    backgroundColor: COLORS.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
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
    paddingBottom: SPACING.xxxl,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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