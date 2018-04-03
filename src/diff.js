
import _ from "./utils"

function diff (oldTree, newTree) {
  let indexObj = { index: 0 }
  let patches = {}

  dfs(oldTree, newTree, indexObj, patches)

  return patches
}

function dfs(oldNode, newNode, indexObj, patches) {
  let currentPatch = []
  let currentIndex = indexObj.index

  indexObj.index++
  if (_.isPrimitive(oldNode) && _.isPrimitive(newNode)) {
    if (oldNode !== newNode) {
      currentPatch.push({
        type: _.patchType.TEXT,
        content: newNode
      })
    }
  } else if (oldNode.tagName === newNode.tagName) {
    let attrPatches = diffAttr(oldNode, newNode)

    if (attrPatches) {
      currentPatch.push({
        type: _.patchType.ATTR,
        attr: attrPatches
      })
    }
    diffChildren(oldNode.children, newNode.children, indexObj, patches, currentPatch)

  } else {
    currentPatch.push({
      type: _.patchType.REPLACE,
      node: newNode
    })
  }

  if (currentPatch.length) {
    patches[currentIndex] = currentPatch
  }

  return patches
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

function diffChildren(oldNodes, newNodes, indexObj, patches, currentPatch) {
  if (_.isPrimitive(oldNodes) || _.isPrimitive(newNodes)) {
    dfs(oldNodes, newNodes, indexObj, patches)
    return
  }

  let oldStartIndex = 0, newStartIndex = 0
  let oldEndIndex = oldNodes.length - 1, newEndIndex = newNodes.length - 1
  let oldStartVnode = oldNodes[0], newStartVnode = newNodes[0]
  let oldEndVnode = oldNodes[oldEndIndex], newEndVnode = newNodes[newEndIndex]

  let keyToIndex

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (_.isSameVnode(oldStartVnode, newStartVnode)) {
      dfs(oldStartVnode, newStartVnode, indexObj, patches)
      oldStartVnode = oldNodes[++oldStartIndex]
      newStartVnode = newNodes[++newStartIndex]
    } else if (_.isSameVnode(oldEndVnode, newEndVnode)) {
      dfs(oldEndVnode, newEndVnode, indexObj, patches)
      oldEndVnode = oldNodes[--oldEndIndex]
      newEndVnode = newNodes[--newEndIndex]
    } else if (_.isSameVnode(oldStartVnode, newEndVnode)) {
      dfs(oldStartVnode, newEndVnode, indexObj, patches)
      currentPatch.push({
        type: _.patchType.REORDER,
        act: {
          type: _.actType.MOVE,
          start: oldStartIndex,
          end: -1
        },
      })
      oldStartVnode = oldNodes[++oldStartIndex]
      newEndVnode = newNodes[--newEndIndex]
    } else if (_.isSameVnode(oldEndVnode, newStartVnode)) {
      dfs(oldEndVnode, newStartVnode, indexObj, patches)
      currentPatch.push({
        type: _.patchType.REORDER,
        act: {
          type: _.actType.MOVE,
          start: oldEndIndex,
          end: newStartIndex
        },
      })
      oldEndVnode = oldNodes[--oldEndIndex]
      newStartVnode = newNodes[++newStartIndex]
    } else {
      if (!keyToIndex) {
        keyToIndex = _.mapKeyToIndex(oldNodes, 0, oldNodes.length-1)
      }

      let index = keyToIndex[newStartVnode.key]

      if (!index) {
        currentPatch.push({
          type: _.patchType.REORDER,
          act: {
            type: _.actType.ADD,
            node: newStartVnode,
            target: newStartIndex,
          },
        })
        newStartVnode = newNodes[++newStartIndex]
      } else {
        let moveNode = oldNodes[index]

        if (moveNode.key !== newStartVnode.key) {
          currentPatch.push({
            type: _.patchType.REPLACE,
            node: newStartVnode
          })
        } else {
          dfs(moveNode, newStartVnode, indexObj, patches)
          currentPatch.push({
            type: _.patchType.REORDER,
            act: {
              type: _.actType.MOVE,
              start: index,
              end: newStartIndex
            },
          })
          newStartVnode = newNodes[++newStartIndex]
        }
      }
    }

    if (oldStartIndex > oldEndIndex) {
      for (; newStartIndex <= newEndIndex; ++newStartIndex) {
        let node = newNodes[newStartIndex]
        if (node) {
          currentPatch.push({
            type: _.patchType.REORDER,
            act: {
              type: _.actType.ADD,
              node: node,
              target: newNodes[newEndIndex+1] == null ? null : newEndIndex + 1
            },
          })
        }
      }
    } else if (newStartIndex > newEndIndex) {
      for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
        let node = oldNodes[oldStartIndex]
        if (node) {
          currentPatch.push({
            type: _.patchType.REORDER,
            act: {
              type: _.actType.DELETE,
              target: oldStartIndex
            }
          })
        }
      }
    }

  }

}

export default diff