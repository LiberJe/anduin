import anduin from "../index.js"

const { h, diff, patch } = anduin

let vdom1 = h("div", {}, [
  h("div", {}, 0),
  h("button", { }, "-"),
  h("button", { }, "+"),
  h("ul", {}, [
    h("li", { key: 'a' }, 'a'),
    h('li', { key: 'b' }, 'b'),
    h("li", { key: 'c' }, 'c'),
    h('li', { key: 'd' }, 'd'),
  ])
])

let vdom2 = h("div", {}, [
  h("h1", {}, 1),
  h("h1", {}, 1),
  h("h1", {}, 1),
  h("div", {}, [
    h('li', { key: 'q' }, 'q'),
    h('li', { key: 'w' }, 'w'),
    h('li', { key: 'r' }, 'r'),
  ]),
  h("button", { props: 'hashKey' }, "-"),
  h("button", { }, "+"),
  h("ul", {}, [
    h('li', { key: 'f' }, 'f'),
    h("li", { key: 'a' }, 'a'),
    h('li', { key: 'b' }, 'b'),
    h('li', { key: 'd' }, 'd'),
    h("li", { key: 'c' }, 'c'),
    h('li', { key: 'e' }, 'e'),
    h('div', {}, [
      h('li', { key: 'p' }, 'p'),
    ])
  ])
])

let root = vdom1.render()

document.body.appendChild(root)

patch(vdom1, vdom2, root)

