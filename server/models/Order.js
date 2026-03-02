const { pool } = require('../config/database')

class Order {
  // Get orders with filters
  static async getAll(query = {}, options = {}) {
    let sql = `SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id`

    const params = []
    const conditions = []

    // Add filters
    if (query.user) {
      conditions.push('o.user_id = ?')
      params.push(query.user)
    }

    if (query.orderStatus) {
      conditions.push('o.order_status = ?')
      params.push(query.orderStatus)
    }

    if (query.payment_status) {
      conditions.push('o.payment_status = ?')
      params.push(query.payment_status)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    // Add sorting with validation
    const sortField = options.sort || 'o.created_at'
    const allowedSortFields = ['o.id', 'o.created_at', 'o.total', 'o.order_status', 'o.payment_status']
    const validSort = allowedSortFields.includes(sortField) ? sortField : 'o.created_at'
    const sortOrder = options.order === 'asc' ? 'ASC' : 'DESC'
    sql += ` ORDER BY ${validSort} ${sortOrder}`

    // Add pagination without parameterized values for MySQL compatibility
    if (options.limit) {
      const limitNum = parseInt(options.limit) || 10
      const skipNum = parseInt(options.skip) || 0
      sql += ` LIMIT ${limitNum} OFFSET ${skipNum}`
    }

    const [rows] = await pool.query(sql, params)

    // Parse JSON fields for each order
    return rows.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : [],
      shipping_address: order.shipping_address ? JSON.parse(order.shipping_address) : null
    }))
  }

  // Count orders
  static async count(query = {}) {
    let sql = 'SELECT COUNT(DISTINCT o.id) as count FROM orders o'
    const params = []
    const conditions = []

    if (query.user) {
      conditions.push('o.user_id = ?')
      params.push(query.user)
    }

    if (query.orderStatus) {
      conditions.push('o.order_status = ?')
      params.push(query.orderStatus)
    }

    if (query.payment_status) {
      conditions.push('o.payment_status = ?')
      params.push(query.payment_status)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    const [rows] = await pool.query(sql, params)
    return rows[0].count
  }

  // Find order by ID
  static async findOne(query) {
    const [rows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?`,
      [query._id || query.id, query.user]
    )

    if (rows.length === 0) return null

    const order = rows[0]
    order.items = order.items ? JSON.parse(order.items) : []
    order.shipping_address = order.shipping_address ? JSON.parse(order.shipping_address) : null

    return order
  }

  // Get order by ID (for admin)
  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?`,
      [id]
    )

    if (rows.length === 0) return null

    const order = rows[0]
    order.items = order.items ? JSON.parse(order.items) : []
    order.shipping_address = order.shipping_address ? JSON.parse(order.shipping_address) : null

    return order
  }

  // Create new order
  static async create(orderData) {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const {
        user,
        items,
        shippingAddress,
        paymentMethod,
        notes,
        subtotal,
        tax,
        shipping,
        total,
        expectedDelivery
      } = orderData

      // Insert order with JSON fields
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          user_id, payment_method, subtotal, tax, shipping, total, notes, 
          expected_delivery, items, shipping_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user, paymentMethod, subtotal, tax, shipping, total, notes, 
          expectedDelivery, JSON.stringify(items), JSON.stringify(shippingAddress)
        ]
      )

      const orderId = orderResult.insertId

      // Also insert into order_items for backward compatibility
      if (items && items.length > 0) {
        const itemValues = items.map(item => [
          orderId,
          item.product,
          item.name,
          item.icon,
          item.price,
          item.quantity,
          item.category
        ])

        const placeholders = itemValues.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ')
        const flattenedValues = itemValues.flat()

        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, name, icon, price, quantity, category)
           VALUES ${placeholders}`,
          flattenedValues
        )
      }

      await connection.commit()

      return { id: orderId, ...orderData }

    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // Update order
  static async updateById(id, updates, options = {}) {
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        // Handle JSON fields
        if (key === 'items' || key === 'shipping_address') {
          fields.push(`${key} = ?`)
          values.push(JSON.stringify(updates[key]))
        } else {
          fields.push(`${key} = ?`)
          values.push(updates[key])
        }
      }
    })

    if (fields.length === 0) return null

    values.push(id)

    await pool.query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    if (options.new !== false) {
      return this.getById(id)
    }
  }

  // Update order status
  static async updateStatus(id, status, trackingNumber = null) {
    const updates = { order_status: status }
    if (trackingNumber) {
      updates.tracking_number = trackingNumber
    }

    return this.updateById(id, updates)
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus, transactionId = null) {
    const updates = { payment_status: paymentStatus }
    if (transactionId) {
      updates.transaction_id = transactionId
    }
    if (paymentStatus === 'Completed') {
      updates.payment_date = new Date()
    }

    return this.updateById(id, updates)
  }

  // Process refund
  static async processRefund(id, refundAmount, refundReason) {
    const updates = {
      payment_status: 'Refunded',
      refund_amount: refundAmount,
      refund_reason: refundReason,
      refund_date: new Date(),
      refund_transaction_id: `REF${Date.now()}`
    }

    return this.updateById(id, updates)
  }

  // Cancel order
  static async cancelOrder(id) {
    return this.updateStatus(id, 'Cancelled')
  }

  // Get order statistics
  static async getStats() {
    const [rows] = await pool.query(`
      SELECT 
        order_status,
        COUNT(*) as count,
        SUM(total) as total_revenue
      FROM orders
      GROUP BY order_status
      ORDER BY count DESC
    `)
    return rows
  }

  // Get payment statistics
  static async getPaymentStats() {
    const [rows] = await pool.query(`
      SELECT 
        payment_status,
        COUNT(*) as count,
        SUM(total) as total_amount
      FROM orders
      GROUP BY payment_status
      ORDER BY count DESC
    `)
    return rows
  }

  // Get recent orders for dashboard
  static async getRecentOrders(limit = 5) {
    const [rows] = await pool.query(
      `SELECT o.id, o.total, o.order_status, o.created_at, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ?`,
      [limit]
    )
    return rows
  }
}

module.exports = Order
