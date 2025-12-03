# KalaKruti Backend Setup Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE "KalaKruti";
CREATE USER postgres WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE "KalaKruti" TO postgres;
```

#### Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=KalaKruti
DB_USER=postgres
DB_PASSWORD=yourpassword
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/KalaKruti?schema=public"
```

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/profile` - Get current user profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/status/:status` - Get projects by status
- `GET /api/projects/:id` - Get project by ID

### Designs
- `GET /api/designs/categories` - Get design categories
- `GET /api/designs/:category` - Get designs by category
- `GET /api/designs/:category/:id` - Get design by ID

### FAQs
- `GET /api/faq` - Get all FAQs
- `GET /api/faq/category/:category` - Get FAQs by category

### Enquiries
- `POST /api/enquiries/contact` - Submit contact form
- `POST /api/enquiries/quote` - Submit quote enquiry

### Calculators
- `POST /api/calculators/home-interior` - Calculate home interior estimate
- `POST /api/calculators/kitchen` - Calculate kitchen estimate
- `POST /api/calculators/wardrobe` - Calculate wardrobe estimate

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/projects` - Upload project image
- `POST /api/upload/designs` - Upload design image

## Default Admin Credentials

After running the seed script:
- **Email**: admin@kalakruti.com
- **Password**: admin123

## File Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── projectController.js
│   │   ├── designController.js
│   │   ├── faqController.js
│   │   ├── enquiryController.js
│   │   ├── calculatorController.js
│   │   └── componentController.js
│   ├── services/       # Business logic
│   │   ├── projectService.js
│   │   ├── designService.js
│   │   ├── faqService.js
│   │   ├── enquiryService.js
│   │   ├── calculatorService.js
│   │   └── componentService.js
│   ├── routes/         # API routes
│   │   ├── projectRoutes.js
│   │   ├── designRoutes.js
│   │   ├── faqRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── calculatorRoutes.js
│   │   ├── componentRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/     # Custom middleware
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   └── utils/          # Utility functions
│       ├── helpers.js
│       └── emailService.js
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Database seeding
├── uploads/            # File upload directory
│   ├── projects/
│   ├── designs/
│   └── components/
├── server.js           # Application entry point
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## Database Models

### Core Entities
- **User**: Admin authentication
- **Project**: Project management (delivered, featured, upcoming)
- **DesignCategory**: Design categories
- **Design**: Individual designs
- **FAQ**: Frequently asked questions
- **Enquiry**: Contact and quote forms
- **ComponentCategory**: Component categories
- **Component**: Kitchen/Wardrobe components
- **CalculatorEstimate**: Price calculation results

### Image Management
- **ProjectImage**: Project images
- **ProjectGallery**: Project gallery images
- **DesignImage**: Design images
- **DesignGallery**: Design gallery images
- **ComponentImage**: Component images

## Development Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=KalaKruti
DB_USER=postgres
DB_PASSWORD=yourpassword
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/KalaKruti?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists
4. Check network connectivity

### Prisma Issues
1. Run `npm run db:generate` after schema changes
2. Use `npm run db:push` for development
3. Use `npm run db:migrate` for production

### File Upload Issues
1. Check upload directory permissions
2. Verify file size limits
3. Ensure proper file types

## Next Steps

1. **Frontend Integration**: Update frontend to use the new API endpoints
2. **Image Management**: Implement image optimization and CDN
3. **Email Templates**: Create professional email templates
4. **API Documentation**: Generate API documentation with Swagger
5. **Testing**: Add unit and integration tests
6. **Deployment**: Set up production deployment

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify environment configuration
3. Ensure all dependencies are installed
4. Check database connectivity

The backend is now ready to serve your KalaKruti frontend application!








