export function isSVG(element) {
  const patt = new RegExp(`^${element}$`, 'i')
  const SVGTags = ['path', 'svg', 'use', 'g']

  return SVGTags.some(tag => patt.test(tag))
}

export function functionToString(func) {
  const signatureArray = func.toString().match(/^\(?(\d*\w*?)\)?=>/)
  let temp = func.toString()
  if(signatureArray)
    temp = func.toString().replace(signatureArray[0], `function (${signatureArray[1]})`)

  if(!temp.match(/^function ?\(.*?\) ?{/)) {
    let c = temp.match(/^function ?\(.*?\) ?/)
    temp = (temp.replace(c[0], c[0] + '{') + '}')
  }

  return `(${temp})(${signatureArray !== null ? 'event' : ''})`
}


export function createFragmentFrom(children) {
  // fragments will help later to append multiple children to the initial node
  const fragment = document.createDocumentFragment()

  function processDOMNodes(child) {
    if (
      child instanceof HTMLElement ||
      child instanceof SVGElement ||
      child instanceof Comment ||
      child instanceof DocumentFragment
    ) {
      fragment.appendChild(child)
    } else if (typeof child === 'string' || typeof child === 'number') {
      const textnode = document.createTextNode(child)
      fragment.appendChild(textnode)
    } else if (child instanceof Array) {
      child.forEach(processDOMNodes)
    } else if (child === false || child === null) {
      // expression evaluated as false e.g. {false && <Elem />}
      // expression evaluated as false e.g. {null && <Elem />}
    } else if (process.env.NODE_ENV === 'development') {
      // later other things could not be HTMLElement nor strings
      console.log(child, 'is not appendable')
    }
  }

  children.forEach(processDOMNodes)

  return fragment
}
