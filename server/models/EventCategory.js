const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const EventCategory = sequelize.define('EventCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50],
      is: /^[a-z0-9-]+$/
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#2563eb',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  defaultReminders: {
    type: DataTypes.JSONB,
    defaultValue: [
      { type: 'email', minutes: 1440 }, // 24 hours
      { type: 'push', minutes: 60 }     // 1 hour
    ]
  }
}, {
  tableName: 'event_categories',
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['sort_order']
    }
  ]
});

module.exports = EventCategory;