const express = require('express');
const app = express();
const port = 3002

const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
})
app.get('/style.css', ()=>{
    res.sendFile(__dirname + '/public/ccs/style.css');
});

app.listen(port, () =>{
    console.log(`corriendo en puerto ${port}`);
})