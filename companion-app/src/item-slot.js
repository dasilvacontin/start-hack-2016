var Item = require('./item.js')

function ItemSlot (id) {
  this.id = id
  this.item = new Item(Math.floor(Math.random() * 3))
  this.createDOMElement()
}

ItemSlot.prototype.createDOMElement = function () {
  this.el = document.createElement('div')
  this.el.className = 'itemslot'
  this.el.appendChild(this.item.el)
  this.el.item = this.item
}

module.exports = ItemSlot
