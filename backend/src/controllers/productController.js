let products = [
  { id: 1, name: "Laptop", quantity: 10 },
  { id: 2, name: "Mouse", quantity: 20 }
];

let nextId = 3;

exports.getProducts = (req, res) => {
  res.json(products);
};

exports.addProduct = (req, res) => {
  const { name, quantity } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  const newProduct = {
    id: nextId++,
    name,
    quantity: quantity || 0
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
};

exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  products = products.filter(p => p.id !== id);

  res.json({ message: "Product deleted" });
};
