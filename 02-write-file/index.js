const fs = require("fs")
const path = require("path")
const { stdout, stdin, exit } = process
const writebleStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), "utf-8")

stdout.write("Hello! Enter your message! \n")
stdin.on("data", (text) => {
  if (text.toString().trim() === "exit") {
    exit()
  }
  writebleStream.write(text)
})

process.on("exit", () => stdout.write("Goodbye! \n"))
process.on("SIGINT", () => process.exit())