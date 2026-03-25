import {
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../utils/api';
import { Picker } from '@react-native-picker/picker';
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

const AdminDetails = () => {
  const { Details: id } = useLocalSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const allowedStatus = [
    'pending',
    'confirmed',
    'dispatched',
    'delivered',
    'cancelled',
  ];

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    } else {
      setError('Invalid booking ID');
      setLoading(false);
    }
  }, [id]);

  const fetchBooking = async (bookingId) => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      const res = await api.get(`/booking/get/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res?.data?.booking) {
        throw new Error('Booking not found');
      }

      setBooking(res.data.booking);
      setStatus(res.data.booking.status || 'pending');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load booking details';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!newStatus || !id) return;

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Session expired. Please login again.');
        return;
      }

      const res = await api.put(
        `/booking/${id}/confirm`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res?.data?.booking) {
        throw new Error('Failed to update status');
      }

      Alert.alert('Success', `Status updated to ${newStatus}`);
      setBooking(res.data.booking);
      setStatus(newStatus);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update status';
      Alert.alert('Error', message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (s) => {
    const map = {
      pending: 'time-outline',
      confirmed: 'checkmark-circle-outline',
      dispatched: 'car-outline',
      delivered: 'checkmark-done-circle-outline',
      cancelled: 'close-circle-outline',
    };
    return map[s?.toLowerCase()] || 'ellipse-outline';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading booking...</Text>
      </View>
    );
  }

  if (error && !booking) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchBooking(id)}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.errorTitle}>Booking not found</Text>
      </View>
    );
  }

  const currentStatusColor = getStatusColor(booking.status);

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

      {/* Title */}
      <Text style={styles.pageTitle}>Booking Details</Text>
      <Text style={styles.pageSubtitle}>
        ID: {booking._id ? `...${booking._id.slice(-8)}` : '—'}
      </Text>

      {/* Current Status Badge */}
      <View
        style={[
          styles.currentStatusBadge,
          { backgroundColor: getStatusBg(booking.status) },
        ]}
      >
        <Ionicons
          name={getStatusIcon(booking.status)}
          size={20}
          color={currentStatusColor}
        />
        <Text style={[styles.currentStatusText, { color: currentStatusColor }]}>
          {booking.status
            ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
            : 'Unknown'}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <InfoRow
          icon="cube-outline"
          label="Cylinder Type"
          value={booking.cylinderType || '—'}
        />
        <View style={styles.divider} />

        <InfoRow
          icon="layers-outline"
          label="Quantity"
          value={booking.quantity != null ? String(booking.quantity) : '—'}
        />
        <View style={styles.divider} />

        <InfoRow
          icon="location-outline"
          label="Address"
          value={booking.address || 'Not provided'}
        />
        <View style={styles.divider} />

        <InfoRow
          icon="calendar-outline"
          label="Booking Date"
          value={
            booking.bookingDate
              ? new Date(booking.bookingDate).toLocaleDateString()
              : '—'
          }
        />
        <View style={styles.divider} />

        <InfoRow
          icon="car-outline"
          label="Delivery Date"
          value={
            booking.deliveryDate
              ? new Date(booking.deliveryDate).toLocaleDateString()
              : 'Not set'
          }
        />
      </View>

      {/* Status Update Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Status</Text>

        {updating ? (
          <View style={styles.updatingContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.updatingText}>Updating...</Text>
          </View>
        ) : Platform.OS === 'android' ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => {
                setStatus(itemValue);
                updateStatus(itemValue);
              }}
              style={{ color: COLORS.textPrimary }}
              dropdownIconColor={COLORS.accent}
            >
              {allowedStatus.map((s) => (
                <Picker.Item key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={s} />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={styles.statusGrid}>
            {allowedStatus.map((s) => {
              const isActive = status === s;
              const sColor = getStatusColor(s);

              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => updateStatus(s)}
                  style={[
                    styles.statusOption,
                    isActive && {
                      backgroundColor: getStatusBg(s),
                      borderColor: sColor,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={getStatusIcon(s)}
                    size={18}
                    color={isActive ? sColor : COLORS.textMuted}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      isActive && { color: sColor },
                    ]}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
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

export default AdminDetails;

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
  retryBtnText: {
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
  pageTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  pageSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  currentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  currentStatusText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
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
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  updatingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  pickerWrapper: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.inputBg,
  },
  statusOptionText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
});