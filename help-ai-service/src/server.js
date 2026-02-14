require('dotenv').config()

const app = require('./app')
const { ensureStorageFiles } = require('./data/store')

const port = Number(process.env.PORT || 3080)

ensureStorageFiles()

app.listen(port, () => {
  console.log(`[help-ai-service] running on http://localhost:${port}`)
})
