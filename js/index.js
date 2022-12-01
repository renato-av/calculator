document.addEventListener('DOMContentLoaded', () => {
  initCalculator()
})

const operations = {
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
}


var stack = []

var current = ''
var currentOperation = ''
const _current = document.querySelector('#current')
const _stack = document.querySelector('#stack')

var isEqualsClicked = false


function calculateWithoutEvalFunction() {
  isEqualsClicked = true
  const priority = [['+', '-'], ['/', '*']]
  var auxPriority = [...priority]
  var error = false

  const getNumbersToOperate = (operationIndex) => {
    const operate = stack.slice(operationIndex - 1, operationIndex + 2)
    stack = stack.filter((_, index) => {
      return index < operationIndex - 1 || index > operationIndex
    })

    return { firstNumber: operate[0], secondNumber: operate[2], symbol: operate[1] }
  }

  while (auxPriority.length > 0) {
    if (error) break

    const symbolPriority = auxPriority.pop()
    var operationIndex = stack.findIndex((e) => symbolPriority.includes(e))

    while (operationIndex !== -1) {
      var { firstNumber, secondNumber, symbol } = getNumbersToOperate(operationIndex)

      const operation = operations[symbol]
      let result = operation(firstNumber, secondNumber)

      if (!isFinite(result)) {
        error = true
        break
      }
      stack[operationIndex - 1] = result

      operationIndex = stack.findIndex((e) => symbolPriority.includes(e))
    }
  }

  if (error) {
    _current.innerHTML = 'error'
    return
  }

  const result = stack[0].toString()
  console.log(result)
  _current.innerHTML = result.length > 10 ? stack[0].toPrecision(10) : result
}

const calculate = () => {
  isEqualsClicked = true
  const result = eval(stack.join(''))

  if (!isFinite(result)) {
    _current.innerHTML = 'error'
    return
  }

  _current.innerHTML = result.toString().length > 10 ? result.toPrecision(10) : result
}

function clear() {
  stack = []
  current = ''
  _stack.innerHTML = '0'
  _current.innerHTML = '0'
}

function initCalculator() {
  const buttons = document.querySelectorAll('button')

  const resetCurrent = () => {
    current = ''
    _current.innerHTML = '0'
  }

  const addToCurrent = (number) => {
    if (current.length <= 0 && number === '0') return

    current += number === '.' && current === '' ? '0.' : number
    _current.innerHTML = current
  }

  const addToStack = (operation) => {
    if (operation === '=') {
      stack.push(Number(current))
      _stack.innerHTML = stack.join(' ')
      calculate()
      return
    }

    stack.push(...[Number(current), operation])
    resetCurrent()
    _stack.innerHTML = stack.join(' ')
  }

  const eraseCurrent = () => {
    current = current.slice(0, current.length - 1)
    if (current.length === 0) {
      _current.innerHTML = '0'
      return
    }
    _current.innerHTML = current
  }

  const currentPercentage = () => {
    if (current.length <= 0) return

    current = (Number(current) / 100).toPrecision(4)
    _current.innerHTML = current
  }


  const typesOperations = {
    'clear': clear,
    'operation': addToStack,
    'erase': eraseCurrent,
    'percentage': currentPercentage,
    'number': addToCurrent
  }

  const onClick = ({ target }) => {
    const type = target.dataset.type

    const fun = typesOperations[type]

    if (isEqualsClicked) {
      isEqualsClicked = false
      clear()
    }

    return fun(target.innerHTML)
  }

  buttons.forEach((button) => {
    button.addEventListener('click', onClick)
  })


}

