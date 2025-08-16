const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Event, School, EventCategory, User, Child, UserEvent } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateEvent = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('isAllDay').optional().isBoolean().withMessage('isAllDay must be a boolean'),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('grades').optional().isArray().withMessage('Grades must be an array'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  body('requiresRSVP').optional().isBoolean().withMessage('requiresRSVP must be a boolean'),
  body('maxAttendees').optional().isInt({ min: 0 }).withMessage('Max attendees must be a positive integer'),
  body('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
];

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('schoolId').optional().isUUID().withMessage('School ID must be a valid UUID'),
  query('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 20,
      schoolId,
      categoryId,
      startDate,
      endDate,
      search,
      status = 'published'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by school (for school admins, only show their school's events)
    if (req.user.role === 'school_admin') {
      // In a real app, you'd get the school ID from the user's association
      // For now, we'll use a placeholder
      whereClause.schoolId = req.user.schoolId || schoolId;
    } else if (schoolId) {
      whereClause.schoolId = schoolId;
    }

    // Filter by category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Filter by date range
    if (startDate || endDate) {
      whereClause.startDate = {};
      if (startDate) whereClause.startDate[Op.gte] = new Date(startDate);
      if (endDate) whereClause.startDate[Op.lte] = new Date(endDate);
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const events = await Event.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'type']
        },
        {
          model: EventCategory,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['startDate', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(events.count / limit);

    res.json({
      success: true,
      data: {
        events: events.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: events.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'type', 'address']
        },
        {
          model: EventCategory,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon', 'description']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: UserEvent,
          as: 'attendees',
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    if (req.user.role === 'school_admin' && event.schoolId !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { event }
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting event'
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Admin/School Admin)
router.post('/', [authenticateToken, requireRole(['admin', 'school_admin'])], validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      isAllDay,
      location,
      grades,
      isRecurring,
      recurrence,
      isPublic,
      requiresRSVP,
      maxAttendees,
      categoryId,
      schoolId,
      tags,
      attachments
    } = req.body;

    // For school admins, ensure they can only create events for their school
    let eventSchoolId = schoolId;
    if (req.user.role === 'school_admin') {
      eventSchoolId = req.user.schoolId; // In real app, get from user association
    }

    // Validate school exists
    const school = await School.findByPk(eventSchoolId);
    if (!school) {
      return res.status(400).json({
        success: false,
        message: 'School not found'
      });
    }

    // Validate category exists
    if (categoryId) {
      const category = await EventCategory.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Event category not found'
        });
      }
    }

    const event = await Event.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isAllDay: isAllDay || false,
      location: location || {},
      grades: grades || [],
      isRecurring: isRecurring || false,
      recurrence: recurrence || {},
      isPublic: isPublic !== undefined ? isPublic : true,
      requiresRSVP: requiresRSVP || false,
      maxAttendees: maxAttendees || null,
      currentAttendees: 0,
      categoryId,
      schoolId: eventSchoolId,
      createdBy: req.user.userId,
      status: 'published',
      tags: tags || [],
      attachments: attachments || [],
      reminderSettings: {
        defaultReminder: 60, // 1 hour
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '07:00'
        }
      }
    });

    const createdEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'type']
        },
        {
          model: EventCategory,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event: createdEvent }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Admin/School Admin)
router.put('/:id', [authenticateToken, requireRole(['admin', 'school_admin'])], validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions
    if (req.user.role === 'school_admin' && event.schoolId !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = { ...req.body };
    
    // Convert dates
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    await event.update(updateData);

    const updatedEvent = await Event.findByPk(id, {
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'type']
        },
        {
          model: EventCategory,
          as: 'category',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Admin/School Admin)
router.delete('/:id', [authenticateToken, requireRole(['admin', 'school_admin'])], async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions
    if (req.user.role === 'school_admin' && event.schoolId !== req.user.schoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting event'
    });
  }
});

// @route   POST /api/events/:id/rsvp
// @desc    RSVP to an event
// @access  Private
router.post('/:id/rsvp', authenticateToken, [
  body('status').isIn(['attending', 'maybe', 'declined']).withMessage('Invalid RSVP status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.requiresRSVP) {
      return res.status(400).json({
        success: false,
        message: 'This event does not require RSVP'
      });
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees && status === 'attending') {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Create or update RSVP
    const [userEvent, created] = await UserEvent.findOrCreate({
      where: {
        userId: req.user.userId,
        eventId: id
      },
      defaults: {
        status,
        notes,
        rsvpDate: new Date()
      }
    });

    if (!created) {
      // Update existing RSVP
      const oldStatus = userEvent.status;
      await userEvent.update({
        status,
        notes,
        rsvpDate: new Date()
      });

      // Update attendee count
      if (oldStatus === 'attending' && status !== 'attending') {
        await event.update({ currentAttendees: event.currentAttendees - 1 });
      } else if (oldStatus !== 'attending' && status === 'attending') {
        await event.update({ currentAttendees: event.currentAttendees + 1 });
      }
    } else if (status === 'attending') {
      // New RSVP with attending status
      await event.update({ currentAttendees: event.currentAttendees + 1 });
    }

    res.json({
      success: true,
      message: 'RSVP updated successfully',
      data: { rsvp: userEvent }
    });

  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating RSVP'
    });
  }
});

module.exports = router;