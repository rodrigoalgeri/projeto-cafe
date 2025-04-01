/**
 * Café Aroma - Database Module
 * 
 * This module provides a simplified database interface using localStorage
 * for storing and retrieving application data including users, orders,
 * menu items, and preferences.
 */

// Database namespace to avoid conflicts with other localStorage usage
const DB_PREFIX = 'cafeAroma_';

// Database structure and default values
const DB_STRUCTURE = {
    users: [],
    orders: [],
    menuItems: [
        // Coffee items
        { id: 'coffee1', category: 'coffee', name: 'Espresso Tradicional', price: 8.00, description: 'Café concentrado extraído sob alta pressão. Intenso e aromático com crema perfeito.' },
        { id: 'coffee2', category: 'coffee', name: 'Cappuccino Italiano', price: 14.00, description: 'Espresso, leite vaporizado e espuma de leite cremosa em proporções iguais.' },
        { id: 'coffee3', category: 'coffee', name: 'Latte Macchiato', price: 15.00, description: 'Leite vaporizado com uma dose de espresso adicionada por cima, criando camadas distintas.' },
        { id: 'coffee4', category: 'coffee', name: 'Mocha', price: 16.50, description: 'Espresso com chocolate, leite vaporizado e uma leve camada de espuma, finalizado com cacau em pó.' },
        { id: 'coffee5', category: 'coffee', name: 'Cold Brew', price: 13.00, description: 'Café extraído a frio por 12 horas, resultando em uma bebida suave e menos ácida.' },
        { id: 'coffee6', category: 'coffee', name: 'Café Aroma Especial', price: 18.00, description: 'Nossa assinatura: espresso duplo, leite de aveia, caramelo salgado e um toque de canela.' },
        
        // Food items
        { id: 'food1', category: 'food', name: 'Avocado Toast', price: 22.00, description: 'Pão artesanal tostado, abacate amassado, ovo pochê, tomate cereja e pimenta do reino.' },
        { id: 'food2', category: 'food', name: 'Ovos Beneditinos', price: 26.00, description: 'Muffin inglês, presunto, ovo pochê e molho hollandaise. Servido com batatas rústicas.' },
        { id: 'food3', category: 'food', name: 'Iogurte com Granola', price: 18.50, description: 'Iogurte grego, granola caseira, mel orgânico e frutas frescas da estação.' },
        { id: 'food4', category: 'food', name: 'Panquecas Americanas', price: 24.00, description: 'Pilha de panquecas fofas com xarope de bordo puro, manteiga e frutas vermelhas.' },
        { id: 'food5', category: 'food', name: 'Omelete do Chef', price: 25.00, description: 'Omelete recheado com queijo, tomate, espinafre e cogumelos. Servido com salada e torradas.' },
        { id: 'food6', category: 'food', name: 'Tapioca Fitness', price: 19.50, description: 'Tapioca recheada com frango desfiado, queijo branco, tomate e rúcula.' },
        
        // Dessert items
        { id: 'dessert1', category: 'dessert', name: 'Brownie de Chocolate', price: 12.00, description: 'Brownie caseiro com chocolate 70% cacau, nozes e borda crocante. Servido com sorvete de baunilha.' },
        { id: 'dessert2', category: 'dessert', name: 'Cheesecake de Frutas Vermelhas', price: 15.00, description: 'Base de biscoito, recheio cremoso de cream cheese e cobertura de calda de frutas vermelhas.' },
        { id: 'dessert3', category: 'dessert', name: 'Torta de Maçã', price: 14.00, description: 'Receita tradicional americana com massa amanteigada, maçãs caramelizadas e uma pitada de canela.' },
        { id: 'dessert4', category: 'dessert', name: 'Tiramisu', price: 16.50, description: 'Sobremesa italiana clássica com camadas de biscoito champagne embebido em café, mascarpone e cacau.' },
        { id: 'dessert5', category: 'dessert', name: 'Cookie de Chocolate', price: 8.50, description: 'Cookie grande com gotas de chocolate belga, servido ainda quente.' },
        { id: 'dessert6', category: 'dessert', name: 'Pudim de Café', price: 13.00, description: 'Nossa especialidade: pudim cremoso com infusão de café especial e calda de caramelo.' }
    ],
    preferences: {}
};

// Initialize the database
function initializeDB() {
    const tables = Object.keys(DB_STRUCTURE);
    
    tables.forEach(table => {
        const tableKey = DB_PREFIX + table;
        
        // Check if table exists
        if (localStorage.getItem(tableKey) === null) {
            // Initialize with default values if provided
            localStorage.setItem(tableKey, JSON.stringify(DB_STRUCTURE[table]));
        }
    });
}

// Generic CRUD operations
const DB = {
    // Get all records from a table
    getAll: function(table) {
        const tableKey = DB_PREFIX + table;
        return JSON.parse(localStorage.getItem(tableKey) || '[]');
    },
    
    // Get a record by ID
    getById: function(table, id) {
        const records = this.getAll(table);
        return records.find(record => record.id === id) || null;
    },
    
    // Find records by a filter function
    find: function(table, filterFn) {
        const records = this.getAll(table);
        return records.filter(filterFn);
    },
    
    // Insert a new record
    insert: function(table, record) {
        const records = this.getAll(table);
        
        // Generate ID if not provided
        if (!record.id) {
            record.id = Date.now().toString();
        }
        
        // Add created_at timestamp
        record.created_at = new Date().toISOString();
        
        records.push(record);
        this.saveTable(table, records);
        
        return record;
    },
    
    // Update a record
    update: function(table, id, updatedData) {
        const records = this.getAll(table);
        const index = records.findIndex(r => r.id === id);
        
        if (index !== -1) {
            // Add updated_at timestamp
            updatedData.updated_at = new Date().toISOString();
            
            // Merge with existing record
            records[index] = { ...records[index], ...updatedData };
            this.saveTable(table, records);
            
            return records[index];
        }
        
        return null;
    },
    
    // Delete a record
    delete: function(table, id) {
        const records = this.getAll(table);
        const index = records.findIndex(r => r.id === id);
        
        if (index !== -1) {
            records.splice(index, 1);
            this.saveTable(table, records);
            return true;
        }
        
        return false;
    },
    
    // Save the entire table
    saveTable: function(table, data) {
        const tableKey = DB_PREFIX + table;
        localStorage.setItem(tableKey, JSON.stringify(data));
    },
    
    // Clear a table
    clearTable: function(table) {
        const tableKey = DB_PREFIX + table;
        localStorage.setItem(tableKey, JSON.stringify([]));
    },
    
    // Reset the entire database
    resetDB: function() {
        const tables = Object.keys(DB_STRUCTURE);
        
        tables.forEach(table => {
            const tableKey = DB_PREFIX + table;
            localStorage.setItem(tableKey, JSON.stringify(DB_STRUCTURE[table]));
        });
    }
};

// User-specific operations
const UserDB = {
    // Register a new user
    register: function(userData) {
        // Check if email already exists
        const existingUser = DB.find('users', user => user.email === userData.email);
        
        if (existingUser.length > 0) {
            throw new Error('Este email já está cadastrado');
        }
        
        return DB.insert('users', userData);
    },
    
    // Login verification
    verifyLogin: function(email, password) {
        const user = DB.find('users', user => user.email === email && user.password === password);
        
        if (user.length > 0) {
            // Return user without password
            const { password, ...safeUser } = user[0];
            return safeUser;
        }
        
        return null;
    },
    
    // Get user by ID
    getUserById: function(userId) {
        const user = DB.getById('users', userId);
        
        if (user) {
            // Return user without password
            const { password, ...safeUser } = user;
            return safeUser;
        }
        
        return null;
    },
    
    // Update user profile
    updateProfile: function(userId, userData) {
        return DB.update('users', userId, userData);
    },
    
    // Change password
    changePassword: function(userId, currentPassword, newPassword) {
        const user = DB.getById('users', userId);
        
        if (!user || user.password !== currentPassword) {
            throw new Error('Senha atual incorreta');
        }
        
        return DB.update('users', userId, { password: newPassword });
    }
};

// Order-specific operations
const OrderDB = {
    // Create a new order
    createOrder: function(orderData) {
        // Generate order number
        orderData.orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
        orderData.status = 'pending';
        
        return DB.insert('orders', orderData);
    },
    
    // Get orders by user ID
    getUserOrders: function(userId) {
        return DB.find('orders', order => order.userId === userId);
    },
    
    // Update order status
    updateOrderStatus: function(orderId, status) {
        return DB.update('orders', orderId, { status: status });
    },
    
    // Get order by ID
    getOrderById: function(orderId) {
        return DB.getById('orders', orderId);
    }
};

// Menu-specific operations
const MenuDB = {
    // Get all menu items
    getAllItems: function() {
        return DB.getAll('menuItems');
    },
    
    // Get menu items by category
    getItemsByCategory: function(category) {
        return DB.find('menuItems', item => item.category === category);
    },
    
    // Add a new menu item (admin function)
    addMenuItem: function(itemData) {
        return DB.insert('menuItems', itemData);
    },
    
    // Update a menu item (admin function)
    updateMenuItem: function(itemId, itemData) {
        return DB.update('menuItems', itemId, itemData);
    },
    
    // Delete a menu item (admin function)
    deleteMenuItem: function(itemId) {
        return DB.delete('menuItems', itemId);
    }
};

// Initialize the database on script load
initializeDB();

// Export the database modules
window.CafeAromaDB = {
    core: DB,
    users: UserDB,
    orders: OrderDB,
    menu: MenuDB
};