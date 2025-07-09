# Infrastructure Ticketing Backend

Node.js backend API for the Infrastructure Ticketing System with PostgreSQL database.

## Setup Instructions

### 1. Database Setup

First, install PostgreSQL on your Ubuntu server:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Create a database and user:

```bash
sudo -u postgres psql

CREATE DATABASE infrastructure_ticketing;
CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE infrastructure_ticketing TO your_db_user;
\q
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your database credentials:
```bash
nano .env
```

Update the following variables:
- `DB_HOST=localhost`
- `DB_USER=your_db_user`
- `DB_PASSWORD=your_secure_password`
- `JWT_SECRET=your_very_secure_jwt_secret_key`

5. Run database migrations:
```bash
npm run migrate
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### 3. Production Deployment

For production deployment on Ubuntu server:

1. Install PM2 for process management:
```bash
sudo npm install -g pm2
```

2. Start the application with PM2:
```bash
pm2 start server.js --name "ticketing-api"
pm2 save
pm2 startup
```

3. Configure Nginx as reverse proxy:
```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ticketing-api
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ticketing-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Default Login

- Email: `admin@company.com`
- Password: `admin123`

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGIN` - Frontend URL for CORS