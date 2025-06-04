'use strict';

class InventoryItem {
    constructor({ sku, name, price }) {
        this.sku = sku;
        this.name = name;
        this.price = price;
    }
}

module.exports = InventoryItem;
