const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  type: {
    type: DataTypes.ENUM('elementary', 'middle', 'high', 'k12', 'charter', 'private'),
    allowNull: false
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidAddress(value) {
        if (!value.street || !value.city || !value.state || !value.zipCode) {
          throw new Error('Address must include street, city, state, and zipCode');
        }
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^\+?[\d\s\-\(\)]+$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  principal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      allowParentEventCreation: false,
      requireApproval: true,
      notificationDefaults: {
        email: true,
        sms: false,
        push: true
      },
      eventCategories: ['academic', 'sports', 'pta', 'closure', 'holiday']
    }
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colors: {
    type: DataTypes.JSONB,
    defaultValue: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b'
    }
  },
  academicYear: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidAcademicYear(value) {
        if (value && (!value.start || !value.end)) {
          throw new Error('Academic year must include start and end dates');
        }
      }
    }
  }
}, {
  tableName: 'schools',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['type']
    },
    {
      fields: ['district']
    }
  ]
});

// Instance methods
School.prototype.getFullAddress = function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
};

School.prototype.isInSession = function() {
  if (!this.academicYear) return true;
  
  const today = new Date();
  const startDate = new Date(this.academicYear.start);
  const endDate = new Date(this.academicYear.end);
  
  return today >= startDate && today <= endDate;
};

module.exports = School;