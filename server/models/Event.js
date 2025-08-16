const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'event_categories',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  isAllDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidLocation(value) {
        if (value && !value.name) {
          throw new Error('Location must have a name');
        }
      }
    }
  },
  grades: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      isValidGrades(value) {
        const validGrades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        if (value && value.some(grade => !validGrades.includes(grade))) {
          throw new Error('Invalid grade level');
        }
      }
    }
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurrence: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidRecurrence(value) {
        if (value && !value.frequency) {
          throw new Error('Recurrence must specify frequency');
        }
      }
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requiresRSVP: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxAttendees: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  currentAttendees: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'draft'
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  reminderSettings: {
    type: DataTypes.JSONB,
    defaultValue: {
      defaultReminders: [
        { type: 'email', minutes: 1440 }, // 24 hours
        { type: 'push', minutes: 60 }     // 1 hour
      ],
      allowCustomReminders: true
    }
  }
}, {
  tableName: 'events',
  indexes: [
    {
      fields: ['school_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_by']
    },
    {
      fields: ['is_public']
    }
  ]
});

// Instance methods
Event.prototype.isUpcoming = function() {
  return new Date() < this.startDate;
};

Event.prototype.isOngoing = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

Event.prototype.isPast = function() {
  return new Date() > this.endDate;
};

Event.prototype.getDuration = function() {
  return this.endDate - this.startDate;
};

Event.prototype.canRSVP = function() {
  return this.requiresRSVP && 
         this.status === 'published' && 
         this.isUpcoming() &&
         (!this.maxAttendees || this.currentAttendees < this.maxAttendees);
};

Event.prototype.toPublicJSON = function() {
  const values = this.toJSON();
  // Remove sensitive fields for public events
  delete values.createdBy;
  delete values.metadata;
  return values;
};

module.exports = Event;