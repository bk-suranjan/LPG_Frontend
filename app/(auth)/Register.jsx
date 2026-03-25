import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import api from '../../utils/api';
import { router, Link } from 'expo-router';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    // Validate
    if (!fullName || !fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email || !email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!phone || !phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (!res?.data) {
        throw new Error('Invalid response from server');
      }

      router.replace('/(auth)/Login');
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({
    icon,
    label,
    value,
    onChangeText,
    placeholder,
    focused,
    onFocus,
    onBlur,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    showToggle,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={focused ? COLORS.accent : COLORS.textMuted}
        />
        <TextInput
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showToggle ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="flame" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join LPG Connect today
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Error */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {renderInput({
              icon: 'person-outline',
              label: 'Full Name',
              value: fullName,
              onChangeText: setFullName,
              placeholder: 'Enter your full name',
              focused: nameFocused,
              onFocus: () => setNameFocused(true),
              onBlur: () => setNameFocused(false),
              autoCapitalize: 'words',
            })}

            {renderInput({
              icon: 'mail-outline',
              label: 'Email',
              value: email,
              onChangeText: setEmail,
              placeholder: 'Enter your email',
              focused: emailFocused,
              onFocus: () => setEmailFocused(true),
              onBlur: () => setEmailFocused(false),
              keyboardType: 'email-address',
            })}

            {renderInput({
              icon: 'call-outline',
              label: 'Phone',
              value: phone,
              onChangeText: setPhone,
              placeholder: 'Enter your phone number',
              focused: phoneFocused,
              onFocus: () => setPhoneFocused(true),
              onBlur: () => setPhoneFocused(false),
              keyboardType: 'phone-pad',
            })}

            {renderInput({
              icon: 'lock-closed-outline',
              label: 'Password',
              value: password,
              onChangeText: setPassword,
              placeholder: 'Create a password',
              focused: passwordFocused,
              onFocus: () => setPasswordFocused(true),
              onBlur: () => setPasswordFocused(false),
              secureTextEntry: true,
              showToggle: true,
            })}

            {renderInput({
              icon: 'shield-checkmark-outline',
              label: 'Confirm Password',
              value: confirmPassword,
              onChangeText: setConfirmPassword,
              placeholder: 'Confirm your password',
              focused: confirmFocused,
              onFocus: () => setConfirmFocused(true),
              onBlur: () => setConfirmFocused(false),
              secureTextEntry: true,
            })}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textPrimary} size="small" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Create Account</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={COLORS.textPrimary}
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/(auth)/Login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.glow,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    ...SHADOWS.medium,
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
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.3,
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
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  loginLink: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});