const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const NotificationSettings = sequelize.define('NotificationSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'event_categories',
      key: 'id'
    }
  },
  email: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  push: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  reminders: {
    type: DataTypes.JSONB,
    defaultValue: [
      { type: 'email', minutes: 1440 }, // 24 hours
      { type: 'push', minutes: 60 }     // 1 hour
    ],
    validate: {
      isValidReminders(value) {
        if (!Array.isArray(value)) {
          throw new Error('Reminders must be an array');
        }
        value.forEach(reminder => {
          if (!reminder.type || !reminder.minutes) {
            throw new Error('Each reminder must have type and minutes');
          }
          if (!['email', 'sms', 'push'].includes(reminder.type)) {
            throw new Error('Invalid reminder type');
          }
          if (reminder.minutes < 0) {
            throw new Error('Reminder minutes must be positive');
          }
        });
      }
    }
  },
  quietHours: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidQuietHours(value) {
        if (value && (value.start < 0 || value.start > 23 || value.end < 0 || value.end > 23)) {
          throw new Error('Quiet hours must be between 0 and 23');
        }
      }
    }
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'America/New_York'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'notification_settings',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['event_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Instance methods
NotificationSettings.prototype.isInQuietHours = function() {
  if (!this.quietHours) return false;
  
  const now = new Date();
  const hour = now.getHours();
  const { start, end } = this.quietHours;
  
  if (start <= end) {
    return hour >= start && hour < end;
  } else {
    // Handles quiet hours that span midnight
    return hour >= start || hour < end;
  }
};

NotificationSettings.prototype.shouldSendNotification = function(type) {
  if (!this.isActive) return false;
  
  // Check if notification type is enabled
  if (!this[type]) return false;
  
  // Check quiet hours for push and SMS
  if ((type === 'push' || type === 'sms') && this.isInQuietHours()) {
    return false;
  }
  
  return true;
};

module.exports = NotificationSettings;