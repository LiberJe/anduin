
import _ from "./utils"

function patch(node, patches) {
  let indexObj = { index: 0 }
  dfs(node, patches, indexObj)
}

function dfs(node, patches, indexObj) {
  let currentPatch = patches[indexObj.index]

  for (let i = 0; i < node.childNodes.length; i++) {
    indexObj.index++
    dfs(node.childNodes[i], patches, indexObj)
  }

  currentPatch && currentPatch.map( patch => {
    switch (patch.type) {
      case _.patchType.REPLACE:
        node.parentNode.replaceChild(patch.node.render(), node)
      case _.patchType.REORDER:
        let target = patch.act.target || patch.act.start
        let currentNode = node.childNodes[target]
        setTimeout(() => {
          reorderChildren(node, patch.act, currentNode)
        }, 0)
        break
      case _.patchType.ATTR:
        updateAttr(node, patch.attr)
        break
      case _.patchType.TEXT:
        node.textContent = patch.content
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function reorderChildren(element, patch, currentNode) {
  switch (patch.type) {
    case _.actType.ADD:
      element.insertBefore(patch.node.render(), element.childNodes[patch.target])
      break
    case _.actType.MOVE:
      element.insertBefore(currentNode, element.childNodes[patch.end])
      break
    case _.actType.DELETE:
      element.removeChild(currentNode)
      break
    default:
      throw new Error('Unknown patch type ' + currentPatch.type)
  }
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

export default patch