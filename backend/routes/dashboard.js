const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    // Get ticket counts by status
    const statusCounts = await pool.query(`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
        COUNT(CASE WHEN sla_is_breached = true THEN 1 END) as breached_sla
      FROM tickets
    `);

    // Get tickets by priority
    const priorityCounts = await pool.query(`
      SELECT priority, COUNT(*) as count
      FROM tickets
      GROUP BY priority
    `);

    // Get tickets by category
    const categoryCounts = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM tickets
      GROUP BY category
    `);

    // Get average resolution time (in hours)
    const avgResolution = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_hours
      FROM tickets
      WHERE resolved_at IS NOT NULL
    `);

    // Get resolution trend for last 7 days
    const resolutionTrend = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as created,
        COUNT(CASE WHEN resolved_at IS NOT NULL AND DATE(resolved_at) = DATE(created_at) THEN 1 END) as resolved
      FROM tickets
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    const stats = statusCounts.rows[0];
    
    // Format priority counts
    const ticketsByPriority = {};
    priorityCounts.rows.forEach(row => {
      ticketsByPriority[row.priority] = parseInt(row.count);
    });

    // Format category counts
    const ticketsByCategory = {};
    categoryCounts.rows.forEach(row => {
      ticketsByCategory[row.category] = parseInt(row.count);
    });

    // Calculate SLA compliance
    const totalTickets = parseInt(stats.total_tickets);
    const breachedTickets = parseInt(stats.breached_sla);
    const slaCompliance = totalTickets > 0 ? ((totalTickets - breachedTickets) / totalTickets * 100) : 100;

    const metrics = {
      totalTickets: parseInt(stats.total_tickets),
      openTickets: parseInt(stats.open_tickets),
      inProgressTickets: parseInt(stats.in_progress_tickets),
      resolvedTickets: parseInt(stats.resolved_tickets),
      closedTickets: parseInt(stats.closed_tickets),
      averageResolutionTime: parseFloat(avgResolution.rows[0].avg_hours || 0).toFixed(1),
      slaCompliance: parseFloat(slaCompliance.toFixed(1)),
      breachedSLA: parseInt(stats.breached_sla),
      ticketsByPriority,
      ticketsByCategory,
      resolutionTrend: resolutionTrend.rows.map(row => ({
        date: row.date,
        created: parseInt(row.created),
        resolved: parseInt(row.resolved)
      }))
    };

    res.json(metrics);

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;