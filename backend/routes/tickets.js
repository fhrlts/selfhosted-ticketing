const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate SLA deadline
const calculateSLADeadline = (priority, createdAt) => {
  const slaHours = {
    critical: 8,
    high: 24,
    medium: 72,
    low: 120
  };
  
  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + slaHours[priority]);
  return deadline;
};

// Helper function to generate ticket ID
const generateTicketId = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM tickets');
  const count = parseInt(result.rows[0].count) + 1;
  return `TKT-${String(count).padStart(3, '0')}`;
};

// Get all tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        sb.id as submitted_by_id, sb.name as submitted_by_name, sb.email as submitted_by_email, sb.avatar as submitted_by_avatar,
        at.id as assigned_to_id, at.name as assigned_to_name, at.email as assigned_to_email, at.avatar as assigned_to_avatar
      FROM tickets t
      LEFT JOIN users sb ON t.submitted_by_id = sb.id
      LEFT JOIN users at ON t.assigned_to_id = at.id
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query);
    
    const tickets = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      category: row.category,
      submittedBy: {
        id: row.submitted_by_id,
        name: row.submitted_by_name,
        email: row.submitted_by_email,
        avatar: row.submitted_by_avatar
      },
      assignedTo: row.assigned_to_id ? {
        id: row.assigned_to_id,
        name: row.assigned_to_name,
        email: row.assigned_to_email,
        avatar: row.assigned_to_avatar
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resolvedAt: row.resolved_at,
      closedAt: row.closed_at,
      sla: {
        deadline: row.sla_deadline,
        timeRemaining: Math.max(0, new Date(row.sla_deadline) - new Date()),
        isBreached: row.sla_is_breached
      },
      resolutionTime: row.resolution_time,
      tags: row.tags || [],
      comments: []
    }));

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, category, tags } = req.body;
    
    if (!title || !description || !priority || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticketId = await generateTicketId();
    const slaDeadline = calculateSLADeadline(priority, new Date());
    
    const result = await pool.query(`
      INSERT INTO tickets (
        id, title, description, status, priority, category, 
        submitted_by_id, sla_deadline, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      ticketId, title, description, 'open', priority, category,
      req.user.id, slaDeadline, tags || []
    ]);

    const ticket = result.rows[0];
    
    res.status(201).json({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      submittedBy: req.user,
      assignedTo: null,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      sla: {
        deadline: ticket.sla_deadline,
        timeRemaining: Math.max(0, new Date(ticket.sla_deadline) - new Date()),
        isBreached: false
      },
      tags: ticket.tags || [],
      comments: []
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    
    if (assignedTo) {
      updates.push(`assigned_to_id = $${paramCount++}`);
      values.push(assignedTo);
    }
    
    if (priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (status === 'resolved') {
      updates.push(`resolved_at = CURRENT_TIMESTAMP`);
    }
    
    if (status === 'closed') {
      updates.push(`closed_at = CURRENT_TIMESTAMP`);
    }

    values.push(id);
    
    const query = `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;