const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const execSyncWrapper = (command) => {
  let stdout = null
  try {
    stdout = execSync(command).toString().trim()
  } catch (error) {
    console.error(error)
  }
  return stdout
}

const main = () => {
  const gitTimestamp000 = execSyncWrapper("git log -1 --format=%ct")
  const timestampSeconds = parseInt(gitTimestamp000.trim())

  // const offsetInSecondsGMTPlus2 = 2 * 60 * 60;
  const now = new Date()
  const january = new Date(now.getFullYear(), 0, 1)
  const july = new Date(now.getFullYear(), 6, 1)
  const isDST =
    now.getTimezoneOffset() <
    Math.max(january.getTimezoneOffset(), july.getTimezoneOffset())
  const offsetInSeconds = isDST ? 3 * 60 * 60 : 2 * 60 * 60

  const date = new Date((timestampSeconds + offsetInSeconds) * 1000)
  const hours1 = date.getHours().toString().padStart(2, "0")
  const minutes1 = date.getMinutes().toString().padStart(2, "0")
  const seconds1 = date.getSeconds().toString().padStart(2, "0")

  const timeCommitPushed = `${hours1}:${minutes1}:${seconds1}`

  //=======================

  const currentTimestamp = Math.floor(Date.now() / 1000)
  const gitTimestampDate1 = new Date(
    (currentTimestamp + offsetInSeconds) * 1000
  )

  const hours = gitTimestampDate1.getHours().toString().padStart(2, "0")
  const minutes = gitTimestampDate1.getMinutes().toString().padStart(2, "0")
  const seconds = gitTimestampDate1.getSeconds().toString().padStart(2, "0")

  const timeUploadingToNetlify = `${hours}:${minutes}:${seconds}`

  const gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD")
  const gitCommitHash = execSyncWrapper("git rev-parse --short=7 HEAD")

  const obj = {
    gitBranch,
    gitCommitHash,
    timeCommitPushed,
    timeUploadingToNetlify,
  }

  const filePath = path.resolve("src/helpers", "generatedGitInfo.json")
  const fileContents = JSON.stringify(obj, null, 2)

  fs.writeFileSync(filePath, fileContents)
}

main()
