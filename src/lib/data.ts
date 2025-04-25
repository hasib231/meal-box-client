// Mock data for the dashboard

// Types
export type Meal = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    dietaryOptions: string[];
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Customer = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address: string;
    orderCount: number;
  };
  
  export type OrderStatus = 'pending' | 'accepted' | 'declined' | 'modified' | 'completed' | 'cancelled';
  
  export type Order = {
    id: string;
    customer: Customer;
    meals: {
      meal: Meal;
      quantity: number;
      specialInstructions?: string;
    }[];
    status: OrderStatus;
    total: number;
    createdAt: string;
    deliveryTime?: string;
    deliveryAddress: string;
    paymentStatus: 'pending' | 'paid' | 'refunded';
  };
  
  // Mock data
  export const meals: Meal[] = [
    {
      id: '1',
      name: 'Grilled Chicken Bowl',
      description: 'Grilled chicken breast with mixed vegetables and brown rice',
      price: 12.99,
      image: 'https://images.pexels.com/photos/6249494/pexels-photo-6249494.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Bowls',
      dietaryOptions: ['High Protein', 'Gluten Free'],
      isAvailable: true,
      createdAt: '2023-09-01T12:00:00Z',
      updatedAt: '2023-09-15T12:00:00Z',
    },
    {
      id: '2',
      name: 'Salmon & Quinoa',
      description: 'Oven-baked salmon with quinoa and steamed vegetables',
      price: 15.99,
      image: 'https://images.pexels.com/photos/2725744/pexels-photo-2725744.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Seafood',
      dietaryOptions: ['High Protein', 'Omega-3'],
      isAvailable: true,
      createdAt: '2023-09-02T12:00:00Z',
      updatedAt: '2023-09-16T12:00:00Z',
    },
    {
      id: '3',
      name: 'Vegan Buddha Bowl',
      description: 'Roasted vegetables, avocado, hummus, and quinoa',
      price: 11.99,
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Vegan',
      dietaryOptions: ['Vegan', 'Gluten Free'],
      isAvailable: true,
      createdAt: '2023-09-03T12:00:00Z',
      updatedAt: '2023-09-17T12:00:00Z',
    },
    {
      id: '4',
      name: 'Steak & Sweet Potato',
      description: 'Grilled steak with roasted sweet potatoes and broccoli',
      price: 16.99,
      image: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Meat',
      dietaryOptions: ['High Protein', 'Low Carb'],
      isAvailable: true,
      createdAt: '2023-09-04T12:00:00Z',
      updatedAt: '2023-09-18T12:00:00Z',
    },
    {
      id: '5',
      name: 'Vegetarian Pasta',
      description: 'Whole wheat pasta with roasted vegetables and pesto',
      price: 10.99,
      image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Vegetarian',
      dietaryOptions: ['Vegetarian'],
      isAvailable: false,
      createdAt: '2023-09-05T12:00:00Z',
      updatedAt: '2023-09-19T12:00:00Z',
    },
  ];
  
  export const customers: Customer[] = [
    {
      id: '1',
      name: 'Emma Thompson',
      email: 'emma@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Cityville',
      orderCount: 12,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '234-567-8901',
      address: '456 Oak Ave, Townsburg',
      orderCount: 8,
    },
    {
      id: '3',
      name: 'Sophia Rodriguez',
      email: 'sophia@example.com',
      phone: '345-678-9012',
      address: '789 Pine Rd, Villageton',
      orderCount: 15,
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james@example.com',
      phone: '456-789-0123',
      address: '101 Cedar Ln, Hamletville',
      orderCount: 5,
    },
  ];
  
  export const orders: Order[] = [
    {
      id: '1',
      customer: customers[0],
      meals: [
        { meal: meals[0], quantity: 2 },
        { meal: meals[2], quantity: 1, specialInstructions: 'Extra hummus please' },
      ],
      status: 'pending',
      total: 37.97,
      createdAt: '2023-09-20T10:30:00Z',
      deliveryAddress: '123 Main St, Cityville',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      customer: customers[1],
      meals: [
        { meal: meals[1], quantity: 1 },
        { meal: meals[3], quantity: 1 },
      ],
      status: 'accepted',
      total: 32.98,
      createdAt: '2023-09-20T11:15:00Z',
      deliveryTime: '2023-09-20T18:30:00Z',
      deliveryAddress: '456 Oak Ave, Townsburg',
      paymentStatus: 'paid',
    },
    {
      id: '3',
      customer: customers[2],
      meals: [
        { meal: meals[2], quantity: 2 },
        { meal: meals[4], quantity: 1 },
      ],
      status: 'completed',
      total: 34.97,
      createdAt: '2023-09-19T14:45:00Z',
      deliveryTime: '2023-09-19T19:00:00Z',
      deliveryAddress: '789 Pine Rd, Villageton',
      paymentStatus: 'paid',
    },
    {
      id: '4',
      customer: customers[3],
      meals: [
        { meal: meals[0], quantity: 1 },
        { meal: meals[3], quantity: 1 },
      ],
      status: 'modified',
      total: 29.98,
      createdAt: '2023-09-20T09:00:00Z',
      deliveryTime: '2023-09-20T19:30:00Z',
      deliveryAddress: '101 Cedar Ln, Hamletville',
      paymentStatus: 'pending',
    },
    {
      id: '5',
      customer: customers[0],
      meals: [
        { meal: meals[1], quantity: 2 },
      ],
      status: 'pending',
      total: 31.98,
      createdAt: '2023-09-20T16:00:00Z',
      deliveryAddress: '123 Main St, Cityville',
      paymentStatus: 'paid',
    },
  ];
  
  // Stats for dashboard
  export const dashboardStats = {
    totalOrders: 156,
    pendingOrders: 8,
    totalRevenue: 4289.56,
    averageOrderValue: 27.50,
    popularMeals: [
      { name: 'Grilled Chicken Bowl', count: 45 },
      { name: 'Salmon & Quinoa', count: 32 },
      { name: 'Vegan Buddha Bowl', count: 28 },
    ],
    recentReviews: [
      { customer: 'Emma T.', rating: 5, comment: 'Delicious and arrived on time!' },
      { customer: 'Michael C.', rating: 4, comment: 'Great taste, packaging could be better.' },
      { customer: 'Sophia R.', rating: 5, comment: 'Fresh ingredients and amazing flavors!' },
    ],
  };