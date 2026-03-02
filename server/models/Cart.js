const { pool } = require('../config/database')

class Cart {
  // Find cart by user ID (alias for findOne)
  static async findByUser(userId) {
    return await this.findOne({ user: userId })
  }

  // Find cart by user ID
  static async findOne(query) {
    const [rows] = await pool.query(
      `SELECT c.*, JSON_ARRAYAGG(
        JSON_OBJECT(
          'product', ci.product_id,
          'name', ci.name,
          'icon', ci.icon,
          'price', ci.price,
          'quantity', ci.quantity,
          'category', ci.category
        )
      ) as items
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = ?
      GROUP BY c.id`,
      [query.user]
    )

    if (rows.length === 0) return null

    const cart = rows[0]
    // Parse items JSON
    cart.items = cart.items && cart.items[0] !== null ? cart.items : []

    return cart
  }

  // Create or update cart
  static async create(cartData) {
    const { user, items = [] } = cartData

    // First, check if cart exists
    let cart = await this.findOne({ user })

    if (!cart) {
      // Create new cart
      const [result] = await pool.query(
        'INSERT INTO carts (user_id) VALUES (?)',
        [user]
      )
      cart = { id: result.insertId, user_id: user, items: [] }
    }

    // Update cart items
    await this.updateCartItems(cart.id, items)

    return this.findOne({ user })
  }

  // Update cart items
  static async updateCartItems(cartId, items) {
    // Clear existing items
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId])

    // Insert new items
    if (items.length > 0) {
      const values = items.map(item => [
        cartId,
        item.product,
        item.name,
        item.icon,
        item.price,
        item.quantity,
        item.category
      ])

      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ')
      const flattenedValues = values.flat()

      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, name, icon, price, quantity, category) VALUES ${placeholders}`,
        flattenedValues
      )
    }
  }

  // Update cart (alias for findOneAndUpdate)
  static async update(query, updates) {
    return await this.findOneAndUpdate(query, updates)
  }

  // Update cart
  static async findOneAndUpdate(query, updates, options = {}) {
    const { user } = query

    if (updates.items !== undefined) {
      let cart = await this.findOne({ user })

      if (!cart) {
        cart = await this.create({ user, items: updates.items })
      } else {
        await this.updateCartItems(cart.id, updates.items)
      }

      if (options.new !== false) {
        return this.findOne({ user })
      }
    }

    return null
  }

  // Clear cart
  static async clearCart(userId) {
    const cart = await this.findOne({ user: userId })
    if (cart) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id])
      await pool.query('UPDATE carts SET total = 0 WHERE id = ?', [cart.id])
    }
  }
}

module.exports = Cart
