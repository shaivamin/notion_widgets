import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Settings,
  ToggleLeft,
  ToggleRight,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      events: true,
      reminders: true,
      updates: false,
      weekly: true
    },
    sms: {
      enabled: false,
      events: false,
      reminders: true,
      updates: false
    },
    push: {
      enabled: true,
      events: true,
      reminders: true,
      updates: true
    },
    reminders: {
      defaultTime: '60', // minutes before event
      quietHours: {
        enabled: true,
        start: '22',
        end: '07'
      }
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In real app, this would call the API to save settings
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  const NotificationSection = ({ title, icon: Icon, description, children }) => (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Notifications - School Events Hub</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600">Adjust your reminder preferences and notification channels</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Email Notifications */}
        <NotificationSection
          title="Email Notifications"
          icon={Mail}
          description="Receive notifications via email"
        >
          <div className="space-y-1">
            <ToggleSwitch
              enabled={settings.email.enabled}
              onChange={() => handleToggle('email', 'enabled')}
              label="Enable Email Notifications"
              description="Receive all notifications via email"
            />
            
            {settings.email.enabled && (
              <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
                <ToggleSwitch
                  enabled={settings.email.events}
                  onChange={() => handleToggle('email', 'events')}
                  label="New Events"
                  description="Get notified when new events are added"
                />
                <ToggleSwitch
                  enabled={settings.email.reminders}
                  onChange={() => handleToggle('email', 'reminders')}
                  label="Event Reminders"
                  description="Receive reminders before events"
                />
                <ToggleSwitch
                  enabled={settings.email.updates}
                  onChange={() => handleToggle('email', 'updates')}
                  label="Event Updates"
                  description="Get notified when events are modified"
                />
                <ToggleSwitch
                  enabled={settings.email.weekly}
                  onChange={() => handleToggle('email', 'weekly')}
                  label="Weekly Summary"
                  description="Receive a weekly summary of upcoming events"
                />
              </div>
            )}
          </div>
        </NotificationSection>

        {/* SMS Notifications */}
        <NotificationSection
          title="SMS Notifications"
          icon={Smartphone}
          description="Receive notifications via text message"
        >
          <div className="space-y-1">
            <ToggleSwitch
              enabled={settings.sms.enabled}
              onChange={() => handleToggle('sms', 'enabled')}
              label="Enable SMS Notifications"
              description="Receive urgent notifications via text message"
            />
            
            {settings.sms.enabled && (
              <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
                <ToggleSwitch
                  enabled={settings.sms.events}
                  onChange={() => handleToggle('sms', 'events')}
                  label="Important Events"
                  description="Get notified about critical events"
                />
                <ToggleSwitch
                  enabled={settings.sms.reminders}
                  onChange={() => handleToggle('sms', 'reminders')}
                  label="Event Reminders"
                  description="Receive reminders before events"
                />
                <ToggleSwitch
                  enabled={settings.sms.updates}
                  onChange={() => handleToggle('sms', 'updates')}
                  label="Urgent Updates"
                  description="Get notified about important changes"
                />
              </div>
            )}
          </div>
        </NotificationSection>

        {/* Push Notifications */}
        <NotificationSection
          title="Push Notifications"
          icon={Bell}
          description="Receive notifications on your device"
        >
          <div className="space-y-1">
            <ToggleSwitch
              enabled={settings.push.enabled}
              onChange={() => handleToggle('push', 'enabled')}
              label="Enable Push Notifications"
              description="Receive instant notifications on your device"
            />
            
            {settings.push.enabled && (
              <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
                <ToggleSwitch
                  enabled={settings.push.events}
                  onChange={() => handleToggle('push', 'events')}
                  label="New Events"
                  description="Get notified when new events are added"
                />
                <ToggleSwitch
                  enabled={settings.push.reminders}
                  onChange={() => handleToggle('push', 'reminders')}
                  label="Event Reminders"
                  description="Receive reminders before events"
                />
                <ToggleSwitch
                  enabled={settings.push.updates}
                  onChange={() => handleToggle('push', 'updates')}
                  label="Event Updates"
                  description="Get notified when events are modified"
                />
              </div>
            )}
          </div>
        </NotificationSection>

        {/* Reminder Settings */}
        <NotificationSection
          title="Reminder Settings"
          icon={Clock}
          description="Configure when and how you receive reminders"
        >
          <div className="space-y-4">
            <div>
              <label className="form-label">Default Reminder Time</label>
              <select
                value={settings.reminders.defaultTime}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  reminders: {
                    ...prev.reminders,
                    defaultTime: e.target.value
                  }
                }))}
                className="form-input"
              >
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
                <option value="10080">1 week before</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Quiet Hours</h4>
                  <p className="text-sm text-gray-600">Don't send notifications during these hours</p>
                </div>
                <button
                  onClick={() => handleToggle('reminders', 'quietHours')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reminders.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reminders.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {settings.reminders.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Time</label>
                    <select
                      value={settings.reminders.quietHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        reminders: {
                          ...prev.reminders,
                          quietHours: {
                            ...prev.reminders.quietHours,
                            start: e.target.value
                          }
                        }
                      }))}
                      className="form-input"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">End Time</label>
                    <select
                      value={settings.reminders.quietHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        reminders: {
                          ...prev.reminders,
                          quietHours: {
                            ...prev.reminders.quietHours,
                            end: e.target.value
                          }
                        }
                      }))}
                      className="form-input"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </NotificationSection>

        {/* Test Notifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Test Notifications</h3>
          </div>
          <div className="card-body">
            <p className="text-sm text-gray-600 mb-4">
              Send yourself a test notification to verify your settings are working correctly.
            </p>
            <div className="flex space-x-3">
              <button className="btn-secondary">
                <Mail className="w-4 h-4 mr-2" />
                Test Email
              </button>
              <button className="btn-secondary">
                <Smartphone className="w-4 h-4 mr-2" />
                Test SMS
              </button>
              <button className="btn-secondary">
                <Bell className="w-4 h-4 mr-2" />
                Test Push
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;