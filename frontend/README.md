# Product Inventory Management System

A full-stack inventory management application with React frontend and Node.js/Express/SQLite backend.

## Features

### Core Features
- ✅ Product search with real-time filtering
- ✅ Category-based filtering
- ✅ Inline editing with instant updates
- ✅ Inventory history tracking
- ✅ CSV import/export functionality
- ✅ Stock status color coding
- ✅ Responsive design

### Technical Implementation
- **Frontend**: React 18, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, SQLite3
- **Features**: RESTful API, CSV processing, optimistic updates

## Project Structure

```
inventory-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── inventory.db (auto-generated)
│   └── uploads/ (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── sample_products.csv
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Create backend directory and install dependencies:
```bash
mkdir backend && cd backend
npm init -y
npm install express sqlite3 cors multer csv-parser json2csv
npm install --save-dev nodemon
```

2. Create `server.js` with the backend code provided

3. Create uploads directory:
```bash
mkdir uploads
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Create frontend with Vite:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Create the following files:
   - `src/App.jsx` (provided)
   - `src/index.css` (provided)
   - `vite.config.js` (provided)
   - `tailwind.config.js` (provided)

3. Update `src/main.jsx`:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

4. Update `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inventory Management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

5. Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?name=<query>` - Search products by name
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `GET /api/products/:id/history` - Get inventory history

### Import/Export
- `POST /api/products/import` - Import CSV (multipart/form-data)
- `GET /api/products/export` - Export CSV

## CSV Format

```csv
name,unit,category,brand,stock,status,image
Laptop,Piece,Electronics,Dell,50,In Stock,laptop.jpg
```

### Required Fields
- `name`: Unique product name
- `unit`: Unit of measurement
- `category`: Product category
- `brand`: Brand name
- `stock`: Number (>= 0)
- `status`: "In Stock" or "Out of Stock"
- `image`: Image filename (optional)

## Deployment

### Backend Deployment (Render)

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: inventory-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

2. Push to GitHub and connect to Render
3. Set environment variables if needed

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify or Vercel

3. Update API_URL in `App.jsx` to point to deployed backend:
```javascript
const API_URL = 'https://your-backend.onrender.com/api';
```

### Alternative: Railway

1. Backend:
```bash
railway login
railway init
railway up
```

2. Frontend:
```bash
railway init
railway up
```

## Usage Guide

### Searching Products
1. Type in the search bar
2. Results filter in real-time
3. Press Enter for server-side search

### Filtering by Category
1. Select category from dropdown
2. Table updates automatically

### Editing Products
1. Click "Edit" button on any row
2. Fields become editable (except Image and ID)
3. Click "Save" to update or "Cancel" to discard

### Viewing History
1. Click on any product row
2. Sidebar opens with inventory history
3. Shows: Date, Old Stock, New Stock, Changed By, Timestamp

### Importing Products
1. Click "Import" button
2. Select CSV file
3. View import summary (added/skipped/duplicates)
4. Table auto-refreshes

### Exporting Products
1. Click "Export" button
2. CSV file downloads automatically
3. Contains all current products

## Features Implementation

### Validation
- Product names must be unique (case-insensitive)
- Stock must be >= 0
- All schema fields required on update

### Inventory Logging
- Automatic log creation on stock changes
- Records: productId, oldStock, newStock, changedBy, timestamp
- Sorted by date DESC

### Error Handling
- Toast notifications for all operations
- Loading states during API calls
- Graceful error messages

### Optimistic Updates
- UI updates immediately on save
- Background refresh for data consistency

## Testing

### Manual Testing Checklist
- [ ] Search functionality
- [ ] Category filtering
- [ ] Inline editing
- [ ] CSV import with duplicates
- [ ] CSV export
- [ ] Inventory history sidebar
- [ ] Stock validation (negative numbers)
- [ ] Name uniqueness validation
- [ ] Responsive design on mobile

### Sample Test Data
Use the provided `sample_products.csv` for testing imports.

## Troubleshooting

### CORS Issues
Ensure backend has CORS enabled:
```javascript
app.use(cors());
```

### Database Locked
Stop all server instances:
```bash
pkill -f node
```

### Port Already in Use
Change ports in:
- Backend: `server.js` (PORT variable)
- Frontend: `vite.config.js` (server.port)

## Performance Considerations

- SQLite database auto-created on first run
- Indexes can be added for large datasets
- Consider pagination for 1000+ products
- CSV parsing streams data for memory efficiency

## Future Enhancements

- [ ] User authentication
- [ ] Role-based access control
- [ ] Advanced search filters
- [ ] Bulk edit operations
- [ ] Image upload functionality
- [ ] Real-time notifications
- [ ] Data analytics dashboard
- [ ] Barcode scanning

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.

---

**Built with** ❤️ **using React, Node.js, and SQLite**