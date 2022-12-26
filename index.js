const express = require("express")
const app = express()
const PORT = 5000

app.use(express.json())
app.get("/", (req, res) => {
    res.status(200).send('hello from backend server')
})
app.get("/about", (req, res) => {
    res.status(200).send('hello from backend server')
})

app.listen(PORT, () => {
    console.log(`server is started on port ${PORT}` || 8080)
})

module.exports = app;