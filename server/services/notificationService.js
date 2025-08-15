const cron = require('node-cron');
const { Event, User, NotificationSettings, UserEvent } = require('../models');
const { Op } = require('sequelize');

class NotificationService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize the notification service
  async initialize() {
    if (this.isInitialized) return;

    console.log('Initializing notification service...');

    // Schedule daily notification check
    cron.schedule('0 6 * * *', () => {
      this.processDailyNotifications();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    // Schedule hourly reminder check
    cron.schedule('0 * * * *', () => {
      this.processReminders();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    // Schedule weekly summary
    cron.schedule('0 8 * * 1', () => {
      this.sendWeeklySummaries();
    }, {
      scheduled: true,
      timezone: 'America/New_York'
    });

    this.isInitialized = true;
    console.log('Notification service initialized');
  }

  // Process daily notifications for upcoming events
  async processDailyNotifications() {
    try {
      console.log('Processing daily notifications...');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Get events happening tomorrow
      const events = await Event.findAll({
        where: {
          startDate: {
            [Op.gte]: tomorrow,
            [Op.lt]: dayAfterTomorrow
          },
          status: 'published',
          isPublic: true
        },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      for (const event of events) {
        await this.sendEventNotifications(event, 'daily');
      }

      console.log(`Processed ${events.length} daily notifications`);
    } catch (error) {
      console.error('Error processing daily notifications:', error);
    }
  }

  // Process reminders for events happening soon
  async processReminders() {
    try {
      console.log('Processing reminders...');

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Get events happening in the next 1-2 hours
      const events = await Event.findAll({
        where: {
          startDate: {
            [Op.gte]: oneHourFromNow,
            [Op.lt]: twoHoursFromNow
          },
          status: 'published'
        },
        include: [
          {
            model: UserEvent,
            as: 'attendees',
            where: {
              status: 'attending'
            },
            include: [
              {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'fcmToken']
              }
            ]
          }
        ]
      });

      for (const event of events) {
        await this.sendEventReminders(event);
      }

      console.log(`Processed ${events.length} reminders`);
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  }

  // Send weekly summaries to users
  async sendWeeklySummaries() {
    try {
      console.log('Sending weekly summaries...');

      const users = await User.findAll({
        where: {
          isActive: true,
          'preferences.notifications.email': true,
          'preferences.notifications.weekly': true
        }
      });

      for (const user of users) {
        await this.sendWeeklySummary(user);
      }

      console.log(`Sent ${users.length} weekly summaries`);
    } catch (error) {
      console.error('Error sending weekly summaries:', error);
    }
  }

  // Send notifications for a specific event
  async sendEventNotifications(event, type = 'new') {
    try {
      // Get users who should be notified about this event
      const users = await this.getUsersToNotify(event);

      for (const user of users) {
        const notificationSettings = await this.getUserNotificationSettings(user.id, event.id);

        if (this.shouldSendNotification(user, notificationSettings, type)) {
          await this.sendNotification(user, event, type);
        }
      }
    } catch (error) {
      console.error(`Error sending ${type} notifications for event ${event.id}:`, error);
    }
  }

  // Send reminders for a specific event
  async sendEventReminders(event) {
    try {
      // Get users who RSVP'd to this event
      const attendees = event.attendees || [];

      for (const attendee of attendees) {
        const user = attendee.User;
        const notificationSettings = await this.getUserNotificationSettings(user.id, event.id);

        if (this.shouldSendReminder(user, notificationSettings)) {
          await this.sendReminder(user, event);
        }
      }
    } catch (error) {
      console.error(`Error sending reminders for event ${event.id}:`, error);
    }
  }

  // Send weekly summary to a user
  async sendWeeklySummary(user) {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      // Get upcoming events for the user's children
      const upcomingEvents = await this.getUpcomingEventsForUser(user.id, startOfWeek, endOfWeek);

      if (upcomingEvents.length > 0) {
        await this.sendEmailNotification(user, {
          type: 'weekly_summary',
          subject: 'Your Weekly School Events Summary',
          events: upcomingEvents
        });
      }
    } catch (error) {
      console.error(`Error sending weekly summary to user ${user.id}:`, error);
    }
  }

  // Get users who should be notified about an event
  async getUsersToNotify(event) {
    try {
      // Get users with children in the relevant grades/school
      const users = await User.findAll({
        where: {
          isActive: true,
          role: 'parent'
        },
        include: [
          {
            model: Child,
            where: {
              schoolId: event.schoolId,
              isActive: true
            },
            required: true
          }
        ]
      });

      return users;
    } catch (error) {
      console.error('Error getting users to notify:', error);
      return [];
    }
  }

  // Get user's notification settings for an event
  async getUserNotificationSettings(userId, eventId) {
    try {
      const settings = await NotificationSettings.findOne({
        where: {
          userId,
          eventId
        }
      });

      if (settings) {
        return settings;
      }

      // Return default settings if none found
      return {
        email: true,
        sms: false,
        push: true,
        reminders: [
          { time: 60, type: 'minutes' }, // 1 hour before
          { time: 1440, type: 'minutes' } // 1 day before
        ],
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00'
        }
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  // Check if notification should be sent
  shouldSendNotification(user, settings, type) {
    if (!settings) return false;

    // Check if in quiet hours
    if (settings.quietHours && settings.quietHours.enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(settings.quietHours.start.split(':')[0]);
      const endHour = parseInt(settings.quietHours.end.split(':')[0]);

      if (currentHour >= startHour || currentHour < endHour) {
        return false;
      }
    }

    // Check notification preferences
    switch (type) {
      case 'email':
        return settings.email;
      case 'sms':
        return settings.sms && user.phone;
      case 'push':
        return settings.push && user.fcmToken;
      default:
        return true;
    }
  }

  // Check if reminder should be sent
  shouldSendReminder(user, settings) {
    if (!settings) return false;

    // Check if reminder was already sent recently
    // This would be implemented with a reminder tracking system
    return true;
  }

  // Send notification to user
  async sendNotification(user, event, type) {
    try {
      const notificationData = {
        userId: user.id,
        eventId: event.id,
        type,
        title: `New Event: ${event.title}`,
        message: `${event.title} is happening on ${new Date(event.startDate).toLocaleDateString()}`,
        data: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startDate
        }
      };

      // Send email notification
      if (this.shouldSendNotification(user, notificationData, 'email')) {
        await this.sendEmailNotification(user, notificationData);
      }

      // Send SMS notification
      if (this.shouldSendNotification(user, notificationData, 'sms')) {
        await this.sendSMSNotification(user, notificationData);
      }

      // Send push notification
      if (this.shouldSendNotification(user, notificationData, 'push')) {
        await this.sendPushNotification(user, notificationData);
      }

      // Log notification
      await this.logNotification(notificationData);

    } catch (error) {
      console.error(`Error sending notification to user ${user.id}:`, error);
    }
  }

  // Send reminder to user
  async sendReminder(user, event) {
    try {
      const notificationData = {
        userId: user.id,
        eventId: event.id,
        type: 'reminder',
        title: `Reminder: ${event.title}`,
        message: `${event.title} starts in 1 hour`,
        data: {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startDate
        }
      };

      // Send push notification for reminders
      if (user.fcmToken) {
        await this.sendPushNotification(user, notificationData);
      }

      // Log reminder
      await this.logNotification(notificationData);

    } catch (error) {
      console.error(`Error sending reminder to user ${user.id}:`, error);
    }
  }

  // Send email notification
  async sendEmailNotification(user, data) {
    try {
      // This would integrate with your email service (SendGrid, etc.)
      console.log(`Sending email to ${user.email}: ${data.title}`);
      
      // Example implementation:
      // await emailService.send({
      //   to: user.email,
      //   subject: data.title,
      //   template: 'event-notification',
      //   data: data
      // });

    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Send SMS notification
  async sendSMSNotification(user, data) {
    try {
      // This would integrate with your SMS service (Twilio, etc.)
      console.log(`Sending SMS to ${user.phone}: ${data.message}`);
      
      // Example implementation:
      // await smsService.send({
      //   to: user.phone,
      //   message: data.message
      // });

    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  }

  // Send push notification
  async sendPushNotification(user, data) {
    try {
      // This would integrate with Firebase Cloud Messaging
      console.log(`Sending push notification to ${user.fcmToken}: ${data.title}`);
      
      // Example implementation:
      // await fcmService.send({
      //   token: user.fcmToken,
      //   title: data.title,
      //   body: data.message,
      //   data: data.data
      // });

    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Get upcoming events for a user
  async getUpcomingEventsForUser(userId, startDate, endDate) {
    try {
      const events = await Event.findAll({
        where: {
          startDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          status: 'published'
        },
        include: [
          {
            model: School,
            as: 'school',
            attributes: ['name']
          },
          {
            model: EventCategory,
            as: 'category',
            attributes: ['name', 'color']
          }
        ],
        order: [['startDate', 'ASC']]
      });

      return events;
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      return [];
    }
  }

  // Log notification for tracking
  async logNotification(data) {
    try {
      // This would save to a notifications log table
      console.log('Notification logged:', data);
      
      // Example implementation:
      // await NotificationLog.create({
      //   userId: data.userId,
      //   eventId: data.eventId,
      //   type: data.type,
      //   sentAt: new Date(),
      //   status: 'sent'
      // });

    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // Manual notification trigger (for testing)
  async triggerNotification(eventId, type = 'new') {
    try {
      const event = await Event.findByPk(eventId, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!event) {
        throw new Error('Event not found');
      }

      await this.sendEventNotifications(event, type);
      console.log(`Manually triggered ${type} notification for event ${eventId}`);

    } catch (error) {
      console.error('Error triggering notification:', error);
      throw error;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;