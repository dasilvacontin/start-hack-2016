var Hammer = require('hammerjs')
var _defer = require('lodash/defer')

var Item = require('./item.js')
var ItemSlot = require('./item-slot.js')

/* prevents scrolling */
function setUpScrollPreventing () {
  var preventer = function (ev) { ev.preventDefault() }
  document.addEventListener('touchstart', preventer)
  document.addEventListener('touchmove', preventer)
}

/* Two-finger Panning handler */
function setUpPanning () {
  var stage = document.body
  var mc = new Hammer(stage)
  var Panner = new Hammer.Pan({
    direction: Hammer.DIRECTION_ALL,
    pointers: 2,
    threshold: 5
  })
  mc.add(Panner)
  mc.on('pan', function (e) {
    console.log(e.center.x, e.center.y)
  })
}

var itemSlots = []
function generateSlots () {
  var itemContainer = document.getElementById('item-container')
  for (var i = 0; i < 10; ++i) {
    var slot = new ItemSlot(i)
    itemContainer.appendChild(slot.el)
    itemSlots.push(slot)
  }
}

function isItem (node) {
  return node.className && node.className.match(/\bitem\b/)
}

function getItem (node) {
  if (!node) return null
  if (isItem(node)) return node
  return getItem(node.parentNode)
}

function getClosestSlot (x, y) {
  var closestSlot = null
  var closestDistance = NaN
  itemSlots.forEach(function (slot) {
    var slotX = slot.el.offsetLeft
    var slotY = slot.el.offsetTop
    var distance = Math.abs(slotX - x) + Math.abs(slotY - y)
    if (isNaN(closestDistance) || distance < closestDistance) {
      closestDistance = distance
      closestSlot = slot
    }
  })
  return closestSlot
}

var draggingItem = null
var startingTouch = null

function cancelDrag (item) {
  draggingItem = null
  item.style.transition = 'all 0.5s'
  _defer(function () { item.style.transform = 'initial' })
  setTimeout(function () {
    if (draggingItem === item) return
    item.classList.remove('dragging')
  }, 500)
}

document.addEventListener('touchstart', function (ev) {
  // started multiple touches, user means to pan
  // cancel current drag
  if (draggingItem) {
    return cancelDrag(draggingItem)
  }
  if (ev.touches.length > 1) return

  var item = getItem(ev.target)
  if (!item) return
  draggingItem = item
  startingTouch = ev
  item.offsetX = 0
  item.offsetY = 0
  item.style.transition = 'initial'
})

document.addEventListener('touchmove', function (ev) {
  if (!draggingItem) return
  if (ev.touches.length > 1) return cancelDrag(draggingItem)
  draggingItem.classList.add('dragging')
  var offsetX = ev.pageX - startingTouch.pageX
  var offsetY = ev.pageY - startingTouch.pageY
  draggingItem.offsetX = offsetX
  draggingItem.offsetY = offsetY
  draggingItem.style.transform = 'translate(' + offsetX + 'px, ' +
    offsetY + 'px)'
})

document.addEventListener('touchend', function (ev) {
  if (!draggingItem) return
  var item = draggingItem
  draggingItem = null
  var x = item.offsetLeft + item.offsetX
  var y = item.offsetTop + item.offsetY
  var type = item.owner.type
  if (y < 50) {
    console.log('USED OBJECT TYPE: ' + type)
    item.owner.setType(Item.TYPES.NONE)
    return
  }
  var closestSlot = getClosestSlot(x, y)
  if (!item.owner.typeFromCombinationWith(closestSlot.item.type)) {
    cancelDrag(item)
    return
  }
  item.classList.remove('dragging')
  item.owner.setType(Item.TYPES.NONE)
  closestSlot.item.combineWith(type)
})

/*
function gotItem (type) {
  var freeSlot = itemSlots.reduce(function (prev, curr) {
    if (prev) return prev
    if (curr.item.type === Item.TYPES.NONE) return curr
    return null
  }, null)
  if (!freeSlot) return
  freeSlot.item.setType(type)
}

setInterval(function () {
  gotItem(Item.TYPES.POTION)
}, 2000)
*/

function main () {
  setUpScrollPreventing()
  setUpPanning()
  generateSlots()
}
main()
