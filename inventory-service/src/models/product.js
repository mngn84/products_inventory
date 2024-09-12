export default class Product {
    constructor(id, plu, name, description) {
      this.id = id;
      this.plu = plu;
      this.name = name;
    }
  
    static fromRow(row) {
      return new Product(row.id, row.plu, row.name, row.description);
    }
  }
  