const { exec } = require("child_process")
const config = require("./config")

idMaps = config.deviceIdMaps

exec("arp -a", (error, stdout, stderr) => {
  if (error) throw error
  console.log("Live PIs:")
  searchForKnownHosts(stdout).forEach(map => console.log(map.name))
})

function searchForKnownHosts(arpOutput) {
  const exploded = arpOutput.split("\n")

  const matches = exploded
    .map(outputLine => {
      return getMapForTargetLines(outputLine)
    })
    .filter(removeEmptyLines)
    .reduce((carry, current) => carry.concat(current), [])

  return matches
}

function getMapForTargetLines(outputLine) {
  return idMaps.filter(map => {
    const pattern = new RegExp(map.macAddress)
    return pattern.test(outputLine)
  })
}

function removeEmptyLines(line) {
  return line.length > 0
}
