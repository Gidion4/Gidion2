import http from "http"
import fs from "fs"
import path from "path"
import WebSocket, { WebSocketServer } from "ws"

const server = http.createServer((req, res) => {
  let filePath = "public" + req.url
  if (req.url === "/") filePath = "public/index.html"

  const abs = path.resolve(filePath)

  if (!fs.existsSync(abs)) {
    res.writeHead(404)
    res.end("Not found")
    return
  }

  const ext = path.extname(abs)
  const type =
    ext === ".html" ? "text/html" :
    ext === ".css" ? "text/css" :
    ext === ".js" ? "application/javascript" :
    "text/plain"

  res.writeHead(200, { "Content-Type": type })
  res.end(fs.readFileSync(abs))
})

const wss = new WebSocketServer({ port: 3001 })

export function broadcast(type: string, payload: string) {
  const msg = JSON.stringify({ type, payload })
  wss.clients.forEach(c => c.send(msg))
}

server.listen(3000, () => {
  console.log("UI server running at http://localhost:3000")
})


