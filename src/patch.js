
import _ from "./utils"

function patch (oldNode, newNode, dom) {
  if (oldNode.tagName === newNode.tagName) {

    let attrPatches = diffAttr(oldNode, newNode)
    attrPatches ? updateAttr(dom, attrPatches) : undefined

    diffChildren(oldNode.children, newNode.children, dom)
  } else {
    dom.parentNode.replaceChild(newNode.render(), dom)
  }
}

function diffAttr(oldNode, newNode) {
  let count = 0
  let oldAttr = oldNode.attributes
  let newAttr = newNode.attributes

  let attrPatches = {}

  for (let key in oldAttr) {
    let value = oldAttr[key]
    if (newAttr[key] !== value) {
      count++
      attrPatches[key] = newAttr[key]
    }
  }

  for (let key in newAttr) {
    let value = newAttr[key]
    if (!oldNode.hasOwnProperty(key)) {
      count++
      attrPatches[key] = value
    }
  }

  if (count > 0) return attrPatches

  return null
}

function updateAttr(element, attributes) {
  for (let key in attributes) {
    let value = attributes[key]
    if (!value) {
      node.removeAttribute(key)
    } else if (key === 'style') {
      node.style.cssText = value
    } else if (typeof value === 'function') {
      element[key] = value
    } else {
      element.setAttribute(key, value)
    }
  }
}

function diffChildren(oldNodes, newNodes, parentDom) {
  if (_.isPrimitive(oldNodes) || _.isPrimitive(newNodes)) {
    if (!_.isPrimitive(newNodes)) {
      parentDom.removeChild(parentDom.childNodes[0])
      let childNodes = newNodes.map(node => {
        parentDom.insertBefore(node.render(), undefined)
      })
    } else {
      parentDom.innerText = newNodes
    }

    return
  }

  let oldStartIndex = 0, newStartIndex = 0
  let oldEndIndex = oldNodes.length - 1, newEndIndex = newNodes.length - 1
  let oldStartVnode = oldNodes[0], newStartVnode = newNodes[0]
  let oldEndVnode = oldNodes[oldEndIndex], newEndVnode = newNodes[newEndIndex]

  let keyToIndex

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (_.isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode, parentDom.childNodes[oldStartIndex])
      oldStartVnode = oldNodes[++oldStartIndex]
      newStartVnode = newNodes[++newStartIndex]
    } else if (_.isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode, parentDom.childNodes[oldEndIndex])
      oldEndVnode = oldNodes[--oldEndIndex]
      newEndVnode = newNodes[--newEndIndex]
    } else if (_.isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode, parentDom.childNodes[oldStartIndex])
      _.delay(parentDom.childNodes[oldStartIndex], parentDom.childNodes[newEndIndex] ? parentDom.childNodes[newEndIndex].nextSibling : undefined)((x, y) => parentDom.insertBefore(x, y))
      oldStartVnode = oldNodes[++oldStartIndex]
      newEndVnode = newNodes[--newEndIndex]
    } else if (_.isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode, parentDom.childNodes[oldEndIndex])
      _.delay(parentDom.childNodes[oldEndIndex], parentDom.childNodes[oldStartIndex])((x, y) => parentDom.insertBefore(x, y))
      oldEndVnode = oldNodes[--oldEndIndex]
      newStartVnode = newNodes[++newStartIndex]
    } else {
      if (!keyToIndex) {
        keyToIndex = _.mapKeyToIndex(oldNodes, 0, oldNodes.length-1)
      }

      let index = keyToIndex[newStartVnode.key]

      if (!index) {
        _.delay(newStartVnode.render(), parentDom.childNodes[oldStartIndex])((x, y) => parentDom.insertBefore(x, y))
        newStartVnode = newNodes[++newStartIndex]
      } else {
        let moveNode = oldNodes[index]

        if (moveNode.key !== newStartVnode.key) {
          _.delay(newStartVnode.render(), parentDom.childNodes[oldStartIndex])((x, y) => parentDom.replaceChild(x, y))
        } else {
          patch(moveNode, newStartVnode, parentDom.childNodes[index])
          oldNodes[index] = undefined
          _.delay(parentDom.childNodes[index], parentDom.childNodes[oldStartIndex])((x, y) => parentDom.insertBefore(x, y))
          newStartVnode = newNodes[++newStartIndex]
        }
      }
    }
  }

  if (oldStartIndex > oldEndIndex) {
    for (; newStartIndex <=  newEndIndex ; newEndIndex--) {
      let node = newNodes[newEndIndex]
      if (node) {
        _.delay(node.render(), parentDom.childNodes[newNodes[newEndIndex+1] == null ? null : 0])((x, y) => parentDom.insertBefore(x, y))
      }
    }
  } else if (newStartIndex > newEndIndex) {
    for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
      let node = oldNodes[oldStartIndex]
      if (node) {
        _.delay(parentDom.childNodes[oldStartIndex])(targetDom => parentDom.removeChild(targetDom))
      }
    }
  }

}

export default patch