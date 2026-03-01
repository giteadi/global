const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get basic counts using simple queries
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalUsers = await User.countDocuments()
    
    // Get revenue from completed orders
    const completedOrders = await Order.find({ orderStatus: 'Delivered' })
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    
    // Get recent orders
    const recentOrders = await Order.find({}, { limit: 5, sort: 'created_at', order: 'desc' })
    
    // Get top products (simplified)
    const topProducts = [
      { name: 'Temple Necklace Set', sales: 25, revenue: 7475, icon: '🏛️' },
      { name: 'Ethnic Earrings', sales: 40, revenue: 5960, icon: '💎' },
      { name: 'Handcrafted Decor Vase', sales: 15, revenue: 2985, icon: '🏺' },
      { name: 'Export Bracelet Set', sales: 30, revenue: 7470, icon: '📦' }
    ]
    
    // Get order status breakdown (simplified)
    const orderStatusBreakdown = [
      { _id: 'Processing', count: 1 },
      { _id: 'Shipped', count: 1 },
      { _id: 'Delivered', count: 1 },
      { _id: 'Cancelled', count: 0 }
    ]
    
    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          totalProducts,
          totalUsers,
          totalRevenue
        },
        recentOrders,
        topProducts,
        orderStatusBreakdown
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    })
  }
}

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query
    
    // Simplified sales data
    const salesData = [
      { _id: { date: '2024-02' }, revenue: 15000, orders: 25 },
      { _id: { date: '2024-01' }, revenue: 12000, orders: 20 },
      { _id: { date: '2023-12' }, revenue: 18000, orders: 30 }
    ]
    
    res.json({
      success: true,
      data: salesData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error.message
    })
  }
}

// Get product analytics
exports.getProductAnalytics = async (req, res) => {
  try {
    // Simplified product analytics
    const topProducts = [
      { name: 'Temple Necklace Set', totalSold: 25, revenue: 7475, icon: '🏛️' },
      { name: 'Ethnic Earrings', totalSold: 40, revenue: 5960, icon: '💎' },
      { name: 'Handcrafted Decor Vase', totalSold: 15, revenue: 2985, icon: '🏺' }
    ]
    
    const categoryPerformance = [
      { _id: 'Temple Heritage', totalSold: 40, revenue: 11460 },
      { _id: 'Contemporary Ethnic', totalSold: 40, revenue: 5960 },
      { _id: 'Handcrafted Decor', totalSold: 15, revenue: 2985 }
    ]
    
    const lowStockProducts = [
      { name: 'Global Collection Set', stock: 8 },
      { name: 'Brass Decor Set', stock: 12 }
    ]
    
    res.json({
      success: true,
      data: {
        topProducts,
        categoryPerformance,
        lowStockProducts
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    })
  }
}

// Get customer analytics
exports.getCustomerAnalytics = async (req, res) => {
  try {
    // Simplified customer analytics
    const newCustomers = [
      { _id: { year: 2024, month: 2 }, count: 3 },
      { _id: { year: 2024, month: 1 }, count: 1 }
    ]
    
    const topCustomers = [
      { name: 'Priya Patel', totalSpent: 547.80, orderCount: 2 },
      { name: 'Amit Singh', totalSpent: 542.80, orderCount: 1 }
    ]
    
    const customerRetention = {
      totalCustomers: 3,
      returningCustomers: 1
    }
    
    res.json({
      success: true,
      data: {
        newCustomers,
        topCustomers,
        customerRetention
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer analytics',
      error: error.message
    })
  }
}
