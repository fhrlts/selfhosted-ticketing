const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Creating database tables...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'agent', 'user')),
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true
      );
    `);
    console.log('✓ Users table created');

    // Create tickets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(20) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
        priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        category VARCHAR(100) NOT NULL,
        submitted_by_id UUID NOT NULL REFERENCES users(id),
        assigned_to_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP WITH TIME ZONE,
        closed_at TIMESTAMP WITH TIME ZONE,
        sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
        sla_time_remaining BIGINT DEFAULT 0,
        sla_is_breached BOOLEAN DEFAULT false,
        resolution_time BIGINT,
        tags TEXT[] DEFAULT '{}',
        notion_id VARCHAR(255)
      );
    `);
    console.log('✓ Tickets table created');

    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id VARCHAR(20) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        author_id UUID NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_internal BOOLEAN DEFAULT false
      );
    `);
    console.log('✓ Comments table created');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
      CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
      CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
    `);
    console.log('✓ Database indexes created');

    // Hash the password properly
    const passwordHash = await bcrypt.hash('admin123', 10);
    console.log('Password hash generated:', passwordHash);

    // Insert default admin user
    const insertResult = await client.query(`
      INSERT INTO users (email, name, password_hash, role, avatar)
      VALUES (
        'admin@company.com',
        'System Administrator',
        $1,
        'admin',
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
      )
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        avatar = EXCLUDED.avatar
      RETURNING id, email, name, role;
    `, [passwordHash]);

    console.log('✓ Default admin user created/updated:', insertResult.rows[0]);

    // Insert some sample users
    const agentPasswordHash = await bcrypt.hash('agent123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);

    await client.query(`
      INSERT INTO users (email, name, password_hash, role, avatar) VALUES
      ('john.doe@company.com', 'John Doe', $1, 'agent', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'),
      ('jane.smith@company.com', 'Jane Smith', $2, 'agent', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'),
      ('user@company.com', 'Regular User', $3, 'user', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400')
      ON CONFLICT (email) DO NOTHING;
    `, [agentPasswordHash, agentPasswordHash, userPasswordHash]);

    console.log('✓ Sample users created');

    // Get admin user ID for sample tickets
    const adminUser = await client.query('SELECT id FROM users WHERE email = $1', ['admin@company.com']);
    const adminId = adminUser.rows[0].id;

    // Insert sample tickets
    const sampleTickets = [
      {
        id: 'TKT-001',
        title: 'Server Database Connection Issues',
        description: 'Production database server experiencing intermittent connection timeouts. Users reporting slow response times and occasional failures.',
        status: 'in_progress',
        priority: 'critical',
        category: 'Database',
        tags: ['production', 'database', 'urgent']
      },
      {
        id: 'TKT-002',
        title: 'Network Latency Issues in Office Network',
        description: 'Several users reporting slow network performance, particularly when accessing shared drives and cloud services.',
        status: 'open',
        priority: 'high',
        category: 'Network',
        tags: ['network', 'performance']
      },
      {
        id: 'TKT-003',
        title: 'Email Server Maintenance Required',
        description: 'Monthly maintenance required for email server. Need to schedule downtime and update all users.',
        status: 'resolved',
        priority: 'medium',
        category: 'Maintenance',
        tags: ['maintenance', 'email']
      }
    ];

    for (const ticket of sampleTickets) {
      const slaDeadline = new Date();
      const slaHours = { critical: 8, high: 24, medium: 72, low: 120 };
      slaDeadline.setHours(slaDeadline.getHours() + slaHours[ticket.priority]);

      await client.query(`
        INSERT INTO tickets (
          id, title, description, status, priority, category, 
          submitted_by_id, sla_deadline, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING;
      `, [
        ticket.id, ticket.title, ticket.description, ticket.status, 
        ticket.priority, ticket.category, adminId, slaDeadline, ticket.tags
      ]);
    }

    console.log('✓ Sample tickets created');

    await client.query('COMMIT');
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
    console.log('\nOther test accounts:');
    console.log('Agent: john.doe@company.com / agent123');
    console.log('User: user@company.com / user123');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database connection successful:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials in .env file are correct');
    console.error('3. Database exists and user has proper permissions');
    throw error;
  }
};

const runMigration = async () => {
  try {
    await testConnection();
    await createTables();
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();