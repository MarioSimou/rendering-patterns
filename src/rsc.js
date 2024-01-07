export const deserialize = payload => {
    const replacer = (key, value) => {
        if (key === '$$typeof') {
            if (value === '$$RE') {
                return Symbol.for('react.element')
            } else {
                return value
            }
        } else {
            return value
        }
    }
    return JSON.parse(payload, replacer)
}

async function renderJSXToClientJSX(jsx) {
    if (typeof jsx === 'string' || typeof jsx === 'number' || typeof jsx === 'boolean' || jsx == null) {
        return jsx
    } else if (Array.isArray(jsx)) {
        return Promise.all(jsx.map(child => renderJSXToClientJSX(child)))
    } else if (jsx != null && typeof jsx === 'object') {
        if (jsx.$$typeof === Symbol.for('react.element')) {
            if (typeof jsx.type === 'string') {
                return {
                    ...jsx,
                    props: await renderJSXToClientJSX(jsx.props),
                }
            } else if (typeof jsx.type === 'function') {
                const Component = jsx.type
                const props = jsx.props
                const returnedJsx = await Component(props)
                return renderJSXToClientJSX(returnedJsx)
            } else if (jsx.type === Symbol.for('react.fragment')) {
                return renderJSXToClientJSX(jsx.props.children)
            } else {
                throw new Error('Not implemented.')
            }
        } else {
            return Object.fromEntries(
                await Promise.all(
                    Object.entries(jsx).map(async ([propName, value]) => [propName, await renderJSXToClientJSX(value)])
                )
            )
        }
    } else throw new Error('Not implemented')
}

export const serialize = async tree => {
    const replacer = (key, value) => {
        if (key === '$$typeof') {
            if (value === Symbol.for('react.element')) {
                return '$$RE'
            } else {
                return value
            }
        } else {
            return value
        }
    }

    const clientJSXTree = await renderJSXToClientJSX(tree)
    return JSON.stringify(clientJSXTree, replacer)
}
