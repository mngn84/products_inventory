export default class Inventory {
    constructor(id, productId, shelfQty, orderQty, shopId) {
      this.id = id;
      this.productId = productId;
      this.shelfQty = shelfQty;
      this.orderQty = orderQty;
      this.shopId = shopId;
    }
  
    static fromRow(row) {
      return new Inventory(row.id, row.product_id, row.shelf_qty, row.order_qty, row.shop_id);
    }
  }
  