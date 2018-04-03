
const patchType = {
  REPLACE: 0,
  REORDER: 1,
  ATTR: 2,
  TEXT: 3
}

const actType = {
  ADD: 0,
  MOVE: 1,
  DELETE: 2,
}

const isArray = Array.isArray

const isPrimitive = input => {
  let type = typeof input
  return type === "string" || type === "number"
}

const isSameVnode = (oldVnode, vnode) => {
  return oldVnode.key === vnode.key && oldVnode.tagName === vnode.tagName
}

const mapKeyToIndex = (nodes, begin, end) => {
  const map = {}

  for (let i = begin; i <= end; i++) {
    let node = nodes[i]
    if (node && node.key) {
      map[node.key] = i
    }
  }

  return map
}

export default {
  patchType,
  actType,
  isPrimitive,
  isArray,
  isSameVnode,
  mapKeyToIndex,
}