var fs = require('fs')
var Mustache = require('mustache')

function Item (type) {
  this.setType(type)
}

Item.prototype.setType = function (type) {
  this.type = type
  this.createDOMElement()
}

Item.prototype.combineWith = function (type) {
  var newType = this.typeFromCombinationWith(type)
  if (!newType) throw new Error()
  this.setType(newType)
}

Item.prototype.typeFromCombinationWith = function (type) {
  if (this.type === Item.TYPES.NONE) return type
  if (type === Item.TYPES.NONE) return this.type
  return false
}

Item.prototype.createDOMElement = function () {
  if (!this.el) this.el = document.createElement('div')
  this.el.owner = this // ugly shiet
  this.el.className = 'item'
  if (this.type === Item.TYPES.NONE) this.el.className += ' item__none'
  this.el.innerHTML = Mustache.render(Item.template, Item.data[this.type])
  this.el.style.transform = 'initial'
}

Item.template = fs.readFileSync(__dirname + '/templates/item.mustache').toString() // eslint-disable-line
Item.TYPES = {
  NONE: 0,
  POTION: 1,
  BOOK: 2
}
Item.data = {}
Item.data[Item.TYPES.NONE] = {}
Item.data[Item.TYPES.POTION] = {
  title: 'Potion',
  imgurl: 'https://cdn1.iconfinder.com/data/icons/outlined-medieval-icons-pack/200/magic_square_flask-128.png'
}
Item.data[Item.TYPES.BOOK] = {
  title: 'Book',
  imgurl: 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/128/book_stack.png'
}

module.exports = Item
