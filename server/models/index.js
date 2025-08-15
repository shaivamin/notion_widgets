const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'school_events_hub',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Import model definitions
const defineUser = require('./User');
const defineChild = require('./Child');
const defineSchool = require('./School');
const defineEvent = require('./Event');
const defineNotificationSettings = require('./NotificationSettings');
const defineEventCategory = require('./EventCategory');
const defineUserEvent = require('./UserEvent');

// Initialize models with sequelize instance
const User = defineUser(sequelize);
const Child = defineChild(sequelize);
const School = defineSchool(sequelize);
const Event = defineEvent(sequelize);
const NotificationSettings = defineNotificationSettings(sequelize);
const EventCategory = defineEventCategory(sequelize);
const UserEvent = defineUserEvent(sequelize);

// Define associations
// User ↔ Child (1:N) — parents manage multiple children
User.hasMany(Child, { foreignKey: 'parent_id', as: 'children' });
Child.belongsTo(User, { foreignKey: 'parent_id', as: 'parent' });

// Child ↔ School (N:1) — each child belongs to one school
Child.belongsTo(School, { foreignKey: 'school_id', as: 'school' });
School.hasMany(Child, { foreignKey: 'school_id', as: 'children' });

// School ↔ Event (1:N) — schools create many events
School.hasMany(Event, { foreignKey: 'school_id', as: 'events' });
Event.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

// Event ↔ EventCategory (N:1) — events belong to categories
Event.belongsTo(EventCategory, { foreignKey: 'category_id', as: 'category' });
EventCategory.hasMany(Event, { foreignKey: 'category_id', as: 'events' });

// Event ↔ NotificationSettings (1:1) — per-user reminder preferences
Event.hasOne(NotificationSettings, { foreignKey: 'event_id', as: 'notificationSettings' });
NotificationSettings.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// User ↔ NotificationSettings (1:N) — users have notification settings
User.hasMany(NotificationSettings, { foreignKey: 'user_id', as: 'notificationSettings' });
NotificationSettings.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User ↔ Event (N:N) — users can subscribe to events
User.belongsToMany(Event, { 
  through: UserEvent, 
  foreignKey: 'user_id', 
  otherKey: 'event_id',
  as: 'subscribedEvents'
});
Event.belongsToMany(User, { 
  through: UserEvent, 
  foreignKey: 'event_id', 
  otherKey: 'user_id',
  as: 'subscribers'
});

// Event ↔ User (N:1) — events are created by users
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });

module.exports = {
  sequelize,
  User,
  Child,
  School,
  Event,
  NotificationSettings,
  EventCategory,
  UserEvent
};