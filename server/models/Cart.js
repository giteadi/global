const { pool } = require('../config/database')

class Cart {
  // Get cart by user ID
  static async getByUser(userId) {
    return await this.getByUserId({ user: userId })
  }

  // Get cart by user ID
  static async getByUserId(query) {
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
    let cart = await this.getByUserId({ user })

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

    return this.getByUserId({ user })
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

  // Clear cart
  static async clearByUser(userId) {
    const cart = await this.getByUserId({ user: userId })
    if (cart) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id])
      await pool.query('UPDATE carts SET total = 0 WHERE id = ?', [cart.id])
    }
  }
}

module.exports = Cart
