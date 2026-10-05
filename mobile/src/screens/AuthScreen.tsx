import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Building2, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';

export const AuthScreen = () => {
  const { login, register, isLoading, error } = useAppStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('admin@business.com');
  const [password, setPassword] = useState('password123');
  const [businessName, setBusinessName] = useState('Apex Traders');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please fill in email and password.');
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim() || !businessName.trim()) {
        Alert.alert('Required', 'Please enter your name and business name.');
        return;
      }
      const ok = await register(fullName, email, password, businessName);
      if (!ok && error) Alert.alert('Error', error);
    } else {
      const ok = await login(email, password);
      if (!ok && error) Alert.alert('Error', error);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('admin@business.com');
    setPassword('password123');
    await login('admin@business.com', 'password123');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Friendly Brand Header */}
      <View style={styles.brandBox}>
        <View style={styles.brandIcon}>
          <Building2 size={36} color="#2563EB" />
        </View>
        <Text style={styles.brandTitle}>Namaste! 🙏</Text>
        <Text style={styles.brandSubtitle}>
          Simple & Smart Dukan Business Management
        </Text>
      </View>

      {/* Auth Card */}
      <View style={styles.card}>
        {/* Mode Selector */}
        <View style={styles.tabWrap}>
          <TouchableOpacity
            style={[styles.tab, !isRegisterMode && styles.tabActive]}
            onPress={() => setIsRegisterMode(false)}
          >
            <Text style={[styles.tabText, !isRegisterMode && styles.tabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, isRegisterMode && styles.tabActive]}
            onPress={() => setIsRegisterMode(true)}
          >
            <Text style={[styles.tabText, isRegisterMode && styles.tabTextActive]}>
              New Business
            </Text>
          </TouchableOpacity>
        </View>

        {isRegisterMode && (
          <>
            <Text style={styles.inputLabel}>Your Name</Text>
            <View style={styles.inputWrap}>
              <User size={16} color="#94A3B8" />
              <TextInput
                style={styles.input}
                placeholder="Rohan Sharma"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={styles.inputLabel}>Shop / Business Name</Text>
            <View style={styles.inputWrap}>
              <Building2 size={16} color="#94A3B8" />
              <TextInput
                style={styles.input}
                placeholder="Apex Traders"
                placeholderTextColor="#94A3B8"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
          </>
        )}

        <Text style={styles.inputLabel}>Business Email</Text>
        <View style={styles.inputWrap}>
          <Mail size={16} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="admin@business.com"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrap}>
          <Lock size={16} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>
                {isRegisterMode ? 'Register Business' : 'Open My Dukan'}
              </Text>
              <ArrowRight size={18} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        {/* 1-Tap Quick Demo */}
        <TouchableOpacity
          style={styles.quickDemoButton}
          onPress={handleQuickDemo}
          activeOpacity={0.8}
        >
          <Sparkles size={16} color="#2563EB" />
          <Text style={styles.quickDemoText}>1-Tap Quick Demo Access</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.securityRow}>
        <ShieldCheck size={16} color="#15803D" />
        <Text style={styles.securityText}>100% Safe & Secure Cloud Sync</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  tabWrap: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 48,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  quickDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quickDemoText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '700',
  },
});
