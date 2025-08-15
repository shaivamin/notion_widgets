const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const UserEvent = sequelize.define('UserEvent', {
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
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('subscribed', 'attending', 'maybe', 'declined'),
    defaultValue: 'subscribed'
  },
  rsvpDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastReminderSent: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_events',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['event_id']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['user_id', 'event_id']
    }
  ]
});

module.exports = UserEvent;