const { pool } = require('../config/database')

class Order {
  // Find orders with filters
  static async find(query = {}, options = {}) {
    let sql = `SELECT o.*, JSON_ARRAYAGG(
      JSON_OBJECT(
        'product', oi.product_id,
        'name', oi.name,
        'icon', oi.icon,
        'price', oi.price,
        'quantity', oi.quantity,
        'category', oi.category
      )
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id`

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

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' GROUP BY o.id'

    // Add sorting
    const sortField = options.sort || 'o.created_at'
    const sortOrder = options.order === 'asc' ? 'ASC' : 'DESC'
    sql += ` ORDER BY ${sortField} ${sortOrder}`

    // Add pagination
    if (options.limit) {
      sql += ` LIMIT ?`
      params.push(options.limit)
    }

    if (options.skip) {
      sql += ` OFFSET ?`
      params.push(options.skip)
    }

    const [rows] = await pool.execute(sql, params)

    // Parse items JSON for each order
    return rows.map(order => ({
      ...order,
      items: order.items && order.items[0] !== null ? order.items : []
    }))
  }

  // Count orders
  static async countDocuments(query = {}) {
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

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    const [rows] = await pool.execute(sql, params)
    return rows[0].count
  }

  // Find order by ID
  static async findOne(query) {
    const [rows] = await pool.execute(
      `SELECT o.*, JSON_ARRAYAGG(
        JSON_OBJECT(
          'product', oi.product_id,
          'name', oi.name,
          'icon', oi.icon,
          'price', oi.price,
          'quantity', oi.quantity,
          'category', oi.category
        )
      ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id`,
      [query._id || query.id, query.user]
    )

    if (rows.length === 0) return null

    const order = rows[0]
    order.items = order.items && order.items[0] !== null ? order.items : []

    return order
  }

  // Find by ID (for admin)
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT o.*, u.name as user_name, u.email as user_email,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product', oi.product_id,
          'name', oi.name,
          'icon', oi.icon,
          'price', oi.price,
          'quantity', oi.quantity,
          'category', oi.category
        )
      ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id, u.name, u.email`,
      [id]
    )

    if (rows.length === 0) return null

    const order = rows[0]
    order.items = order.items && order.items[0] !== null ? order.items : []

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

      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          user_id, shipping_name, shipping_phone, shipping_email,
          shipping_street, shipping_city, shipping_state, shipping_pincode, shipping_country,
          payment_method, subtotal, tax, shipping, total, notes, expected_delivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user, shippingAddress.name, shippingAddress.phone, shippingAddress.email,
          shippingAddress.street, shippingAddress.city, shippingAddress.state,
          shippingAddress.pincode, shippingAddress.country, paymentMethod,
          subtotal, tax, shipping, total, notes, expectedDelivery
        ]
      )

      const orderId = orderResult.insertId

      // Insert order items
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
  static async findByIdAndUpdate(id, updates, options = {}) {
    const fields = []
    const values = []

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`)
        values.push(updates[key])
      }
    })

    if (fields.length === 0) return null

    values.push(id)

    await pool.execute(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    if (options.new !== false) {
      return this.findById(id)
    }
  }
}

module.exports = Order
