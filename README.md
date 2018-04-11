# Anduin
A simple virtual-dom

## Install
```
$ npm install -S anduin
```

## Example
```
import { h, diff, patch } from 'anduin'

// use `h(tagName, [attribute], children)` to create a virtual dom tree.
let vdom1 = h("div", {}, [
  h("h1", {}, 0),
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
  h("button", { props: 'hashKey' }, "-"),
  h("button", { }, "+"),
  h("ul", {}, [
    h('li', { key: 'f' }, 'f'),
    h("li", { key: 'a' }, 'a'),
    h('li', { key: 'b' }, 'b'),
    h('li', { key: 'd' }, 'd'),
    h("li", { key: 'c' }, 'c'),
    h('li', { key: 'e' }, 'e'),
  ])
])

// generate a real dom from virtual dom.
let root = vdom1.render()

document.body.appendChild(root)

// diff two virtual dom trees and apply patches to real dom
patch(vdom1, vdom2, root)
``` 

You can checkout full codes in `example` folder.

## Reference

>[snabbdom](https://github.com/snabbdom/snabbdom)
