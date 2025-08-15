const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Child = sequelize.define('Child', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'schools',
        key: 'id'
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.ENUM('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'),
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    emergencyContact: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'children'
  });

  // Instance methods
  Child.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  Child.prototype.getAge = function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return Child;
};