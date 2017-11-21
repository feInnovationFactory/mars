const MAP_1 = `size: 19
//                *
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 2 2 2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1
1 2 0 1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1
1 1 1 1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1
1 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 1
1 0 0 0 0 2 2 1 2 2 2 2 2 2 0 0 0 0 1
1 0 0 0 0 2 2 1 2 2 2 2 2 2 0 0 0 0 1
1 0 0 0 0 2 2 2 2 2 2 2 2 2 0 0 0 0 1
1 0 0 0 0 2 2 2 2 2 2 2 2 2 0 0 0 0 1
1 0 0 0 0 2 2 2 2 2 2 2 2 2 0 0 0 0 1
1 0 0 0 0 2 2 2 2 2 2 1 2 2 0 0 0 0 1
1 0 0 0 0 2 2 2 2 2 2 1 2 2 0 0 0 0 1
1 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0 1
1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 1 1 1
1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0 2 1
1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2 2 2 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1`

export const parseMap = (source) => {
  const lines = source.split('\n')
  let sizeInited = false
  let size
  let data = []
  lines.forEach((line) => {
    if (!sizeInited && line.indexOf('size:') > -1) {
      size = +line.replace('size:', '').trim()
      sizeInited = true
    } else if (line.indexOf('//') === -1) {
      data.push(line.split(' ').map(val => {
        return {
          type: parseInt(val, 10)
        }
      }))
    }
  })

  if (!size && data[0]) {
    size = data[0].length
  }

  return {
    size,
    data
  }
}

export const firstMap = parseMap(MAP_1)
