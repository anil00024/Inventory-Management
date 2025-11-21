const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// In-memory database (replace with real DB in production)
let products = [
  {
    id: 1,
    name: 'Laptop',
    unit: 'Piece',
    category: 'Electronics',
    brand: 'Dell',
    stock: 25,
    status: 'In Stock',
    image: ''
  },
  {
    id: 2,
    name: 'Mouse',
    unit: 'Piece',
    category: 'Electronics',
    brand: 'Logitech',
    stock: 150,
    status: 'In Stock',
    image: ''
  },
  {
    id: 3,
    name: 'Keyboard',
    unit: 'Piece',
    category: 'Electronics',
    brand: 'Corsair',
    stock: 0,
    status: 'Out of Stock',
    image: ''
  },
  {
    id: 4,
    name: 'Monitor',
    unit: 'Piece',
    category: 'Electronics',
    brand: 'Samsung',
    stock: 30,
    status: 'In Stock',
    image: ''
  },
  {
    id: 5,
    name: 'Desk Chair',
    unit: 'Piece',
    category: 'Furniture',
    brand: 'Herman Miller',
    stock: 12,
    status: 'In Stock',
    image: ''
  }
];

let inventoryHistory = [];
let nextId = products.length + 1;

// Helper function to log history
function logInventoryChange(productId, oldStock, newStock, changedBy) {
  inventoryHistory.push({
    id: inventoryHistory.length + 1,
    productId,
    oldStock,
    newStock,
    changedBy,
    timestamp: new Date().toISOString()
  });
}

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Search products by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(filtered);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Get product history
app.get('/api/products/:id/history', (req, res) => {
  const productId = parseInt(req.params.id);
  const history = inventoryHistory
    .filter(h => h.productId === productId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(history);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const oldProduct = products[productIndex];
  const updatedProduct = {
    ...oldProduct,
    ...req.body,
    id: productId
  };

  // Log stock changes
  if (oldProduct.stock !== updatedProduct.stock) {
    logInventoryChange(
      productId,
      oldProduct.stock,
      updatedProduct.stock,
      req.body.changedBy || 'Unknown'
    );
  }

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Import products from CSV
app.post('/api/products/import', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  let added = 0;
  let skipped = 0;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Check if product already exists (by name)
      const exists = products.find(p => 
        p.name.toLowerCase() === data.name.toLowerCase()
      );

      if (!exists) {
        const newProduct = {
          id: nextId++,
          name: data.name || '',
          unit: data.unit || 'Piece',
          category: data.category || 'Uncategorized',
          brand: data.brand || '',
          stock: parseInt(data.stock) || 0,
          status: data.status || 'In Stock',
          image: data.image || ''
        };
        products.push(newProduct);
        added++;
      } else {
        skipped++;
      }
    })
    .on('end', () => {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      res.json({ added, skipped, total: added + skipped });
    })
    .on('error', (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Error processing CSV file' });
    });
});

// Export products to CSV
app.get('/api/products/export', (req, res) => {
  try {
    const fields = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting products' });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: nextId++,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/products`);
});