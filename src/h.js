
import _ from "./utils"

class Element {
  constructor (tagName, attributes, children) {
    this.tagName = tagName
    this.attributes = attributes || {}
    this.children = children
    this.key = attributes && attributes.key
  }

  render () {
    let el = document.createElement(this.tagName)
    let attributes = this.attributes
    let children = this.children

    for (let attrName in attributes) {
      el.setAttribute(attrName, attributes[attrName])
    }

    [].concat(children).map(child => {
      let childEl = (child instanceof Element)
        ? child.render()
        : document.createTextNode(child)
      el.appendChild(childEl)
    })

    return el
  }
}

export default (tagName, attributes, children) => new Element(tagName, attributes, children)