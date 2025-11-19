import fs from 'fs'
import path from 'path'

// Simple file-based database simulation
const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper function to read JSON file
function readJsonFile<T>(filePath: string, defaultValue: T[]): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
  }
  return defaultValue
}

// Helper function to write JSON file
function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
  }
}

// Products database operations
export const productsDB = {
  getAll: (): any[] => readJsonFile(PRODUCTS_FILE, []),
  
  getById: (id: number): any | null => {
    const products = readJsonFile(PRODUCTS_FILE, [])
    return products.find(p => p.id === id) || null
  },
  
  create: (product: any): any => {
    const products = readJsonFile(PRODUCTS_FILE, [])
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.push(newProduct)
    writeJsonFile(PRODUCTS_FILE, products)
    return newProduct
  },
  
  update: (id: number, updates: any): any | null => {
    const products = readJsonFile(PRODUCTS_FILE, [])
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    writeJsonFile(PRODUCTS_FILE, products)
    return products[index]
  },
  
  delete: (id: number): boolean => {
    const products = readJsonFile(PRODUCTS_FILE, [])
    const filtered = products.filter(p => p.id !== id)
    if (filtered.length === products.length) return false
    
    writeJsonFile(PRODUCTS_FILE, filtered)
    return true
  }
}

// Orders database operations
export const ordersDB = {
  getAll: (): any[] => readJsonFile(ORDERS_FILE, []),
  
  getById: (id: string): any | null => {
    const orders = readJsonFile(ORDERS_FILE, [])
    return orders.find(o => o.id === id) || null
  },
  
  create: (order: any): any => {
    const orders = readJsonFile(ORDERS_FILE, [])
    orders.push(order)
    writeJsonFile(ORDERS_FILE, orders)
    return order
  },
  
  update: (id: string, updates: any): any | null => {
    const orders = readJsonFile(ORDERS_FILE, [])
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) return null
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    writeJsonFile(ORDERS_FILE, orders)
    return orders[index]
  },
  
  delete: (id: string): boolean => {
    const orders = readJsonFile(ORDERS_FILE, [])
    const filtered = orders.filter(o => o.id !== id)
    if (filtered.length === orders.length) return false
    
    writeJsonFile(ORDERS_FILE, filtered)
    return true
  }
}

// Contacts database operations
export const contactsDB = {
  getAll: (): any[] => readJsonFile(CONTACTS_FILE, []),
  
  create: (contact: any): any => {
    const contacts = readJsonFile(CONTACTS_FILE, [])
    const newContact = {
      ...contact,
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    }
    contacts.push(newContact)
    writeJsonFile(CONTACTS_FILE, contacts)
    return newContact
  }
}

// Initialize with sample data if files don't exist
export function initializeDatabase() {
  // Load products from the updated products.json file
  const existingProducts = readJsonFile(PRODUCTS_FILE, [])
  
  // If no products exist, the products.json file will be created with the new faith-based products
  if (existingProducts.length === 0) {
    console.log('No products found, will use products.json file')
  } else {
    console.log(`Loaded ${existingProducts.length} products from database`)
  }

  // Initialize orders if file doesn't exist
  if (!fs.existsSync(ORDERS_FILE)) {
    writeJsonFile(ORDERS_FILE, [])
    console.log('Initialized orders database')
  }

  // Initialize contacts if file doesn't exist
  if (!fs.existsSync(CONTACTS_FILE)) {
    writeJsonFile(CONTACTS_FILE, [])
    console.log('Initialized contacts database')
  }
}


