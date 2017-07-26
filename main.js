let model = {

  actions: '',

  lock: [],

  xSort: function (row, direction) {
    let empty = []
    let occupied = []

    for (let item of row) {
      if (item === '.') {
        empty.push(item)
      } else {
        occupied.push(item)
      }
    }
    if (direction === 'L' || direction === 'U') {
      return occupied.concat(empty)
    } else {
      return empty.concat(occupied)
    }
  },
  ySort: function (lock, direction) {
    for (let k = 0; k < lock[0].length; k++) {
      let column = []

      for (let row of lock) {
        column.push(row[k])
      }
      column = this.xSort(column, direction)

      for (let index in lock) {
        lock[index][k] = column[index]
      }
    }
    return lock
  }
}
let controller = {

  init: function () {
    document.querySelector('.lock-input').value = `.V..PD.O..\n.MF.......\nQ.....I...\n....JNJ...\n.Y..O.O.J.\nV..U......\n..J..H....\n....T.J...\nW.....A.B.\n.P....O.K.`
    model.lock = document.querySelector('.lock-input').value.split('\n').map(item => item.split(''))
    view.display(model.lock)
    this.resetLock()
    this.actionButtons()
    this.inputFields()
  },
  verifyLockInput: function (array) {
    array = document.querySelector('.lock-input').value.split('\n').map(item => item.split(''))
    return array.some((item, _, arr) => item.length !== arr[0].length)
  },
  actionButtons: function () {
    document.querySelector('.sort-buttons').addEventListener('click', function (e) {
      if (controller.verifyLockInput(model.lock)) {
        window.alert('Your rows are not all the same length')
      } else {
        if (e.target.className === 'up-sort') {
          model.lock = model.ySort(model.lock, 'U')
          view.display(model.lock)
        } else if (e.target.className === 'left-sort') {
          model.lock = model.lock.map(row => model.xSort(row, 'L'))
          view.display(model.lock)
        } else if (e.target.className === 'right-sort') {
          model.lock = model.lock.map(row => model.xSort(row, 'R'))
          view.display(model.lock)
        } else if (e.target.className === 'down-sort') {
          model.lock = model.ySort(model.lock, 'D')
          view.display(model.lock)
        }
      }
    })
  },
  inputFields: function () {
    document.querySelector('.perform').addEventListener('click', function (e) {
      if (!(/[uldr]/ig.test(document.querySelector('.actions-input').value))) {
        window.alert('Please enter only the following characters: U L D R')
      } else if (controller.verifyLockInput(model.lock)) {
        window.alert('Your rows are not all the same length')
      } else {
        model.actions = document.querySelector('.actions-input').value.toUpperCase();
        (function theLoop (actions, i) {
          setTimeout(function () {
            if (actions[i] === 'L' || actions[i] === 'R') {
              model.lock = model.lock.map((row) => model.xSort(row, actions[i]))
              view.display(model.lock)
            } else {
              model.lock = model.ySort(model.lock, actions[i])
              view.display(model.lock)
            }
            i++
            if (i < actions.length) {
              theLoop(actions, i)
            }
          }, 250)
        })(model.actions, 0)
      }
    })
  },
  resetLock: function () {
    document.querySelector('.reset-lock').addEventListener('click', function (e) {
      model.lock = document.querySelector('.lock-input').value.split('\n').map(item => item.split(''))
      let rowLengthTest = model.lock.some((item, _, arr) => item.length !== arr[0].length)
      if (rowLengthTest) {
        window.alert('Your rows are not all the same length')
      } else {
        view.display(model.lock)
      }
    })
  },
  tileMouseHover: function () {
    document.querySelector('.grid').addEventListener('mouseover', function (e) {
      let tileList = document.querySelectorAll('.tile')
      let width = model.lock[0].length
      tileList.forEach(function (item) {
        if (parseInt(item.id) % width === parseInt(e.target.id) % width || Math.floor(parseInt(item.id) / width) === Math.floor(parseInt(e.target.id) / width)) {
          item.className += ' highlight-tile'
        }
      })
    })
    document.querySelector('.grid').addEventListener('mouseout', function (e) {
      let tileList = document.querySelectorAll('.tile')
      let width = model.lock[0].length
      tileList.forEach(function (item) {
        if (parseInt(item.id) % width === parseInt(e.target.id) % width || Math.floor(parseInt(item.id) / width) === Math.floor(parseInt(e.target.id) / width)) {
          item.className = item.className.substring(0, item.className.indexOf(' highlight-tile'))
        }
      })
    })
  },
  tileToggleEdit: function () {
    document.querySelector('.grid').addEventListener('click', function (e) {
      if (e.target.id) {
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
        e.target.nextSibling.focus()
      }
    })
  },
  tileSaveChange: function () {
    document.querySelector('.grid').addEventListener('keydown', function (e) {
      let y = Math.floor(parseInt(e.target.previousSibling.id) / model.lock[0].length)
      let x = parseInt(e.target.previousSibling.id) % model.lock[0].length
      if (e.which === 13 && e.target.className === 'tile-input') {
        model.lock[y][x] = e.target.value
          if (!model.lock[y][x])
            model.lock[y][x] = '.'
        view.display(model.lock)
      } else if (e.which === 27 && e.target.className === 'tile-input') {
        e.target.style.display = 'none'
        e.target.previousSibling.style.display = 'flex'
      }
    })
  },
  tileBlur: function () {
    document.querySelector('.grid').addEventListener('blur', function (e) {
      e.target.style.display = 'none'
      e.target.previousSibling.style.display = 'flex'
    }, true)
  }
}
let view = {

  makeGrid: function (array) {
    let grid = document.createElement('section')
    grid.className = 'grid'
    if (array.length > array[0].length) {
      grid.style.height = '100%'
      grid.style.width = `${(array[0].length / array.length) * 100}%`
    } else if (array.length < array[0].length) {
      grid.style.height = `${(array.length / array[0].length) * 100}%`
      grid.style.width = '100%'
    } else {
      grid.style.height = '100%'
      grid.style.width = '100%'
    }
    return grid
  },
  makeTiles: function (array, x, y) {
    let tile = document.createElement('div')
    tile.id = x + (y * array[y].length)
    tile.style.width = `${100 / array[y].length}%`
    tile.style.height = `${100 / array.length}%`
    return tile
  },
  appendTiles: function (array, x, y, tile, parent) {
    let emptyTest = /\w/ig.test(array[y][x])
    if (emptyTest) {
      tile.textContent = array[y][x]
      tile.style.fontSize = `${350 / array[y].length}px`
      tile.className = 'tile tile-occupied'
      parent.appendChild(tile)
    } else {
      tile.className = 'tile tile-empty'
      parent.appendChild(tile)
    }
  },
  makeTileInputs: function (array, y, prev, parent) {
    let tileNext = document.createElement('input')
    tileNext.type = 'text'
    tileNext.className = 'tile tile-input'
    tileNext.value = prev.textContent
    tileNext.style.width = `${100 / array[y].length}%`
    tileNext.style.height = `${100 / array.length}%`
    tileNext.style.fontSize = `${400 / array[y].length}px`
    tileNext.style.display = 'none'
    parent.appendChild(tileNext)
  },
  display: function (array) {
    let gridContainer = document.querySelector('.grid-container')
    gridContainer.innerHTML = ''
    let grid = this.makeGrid(array)
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        let tile = this.makeTiles(array, j, i)
        this.appendTiles(array, j, i, tile, grid)
        this.makeTileInputs(array, i, tile, grid)
      }
    }
    gridContainer.appendChild(grid)
    controller.tileMouseHover()
    controller.tileToggleEdit()
    controller.tileSaveChange()
    controller.tileBlur()
  }
}
controller.init()
