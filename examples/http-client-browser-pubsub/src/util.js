const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

const Logger = outEl => {
  outEl.innerHTML = ''
  return message => {
    const container = document.createElement('div')
    container.innerHTML = message
    outEl.appendChild(container)
    outEl.scrollTop = outEl.scrollHeight
  }
}

const onEnterPress = fn => {
  return e => {
    if (event.which == 13 || event.keyCode == 13) {
      e.preventDefault()
      fn()
    }
  }
}

const catchAndLog = (fn, log) => {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (err) {
      console.error(err)
      log(`<span class="red">${err.message}</span>`)
    }
  }
}

export {
  sleep,
  Logger,
  onEnterPress,
  catchAndLog
}
