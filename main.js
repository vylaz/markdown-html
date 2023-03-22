const express = require('express');
const app = express();
const fs = require('fs');
const showdown = require('showdown');
const converter = new showdown.Converter({
    noHeaderId: true,
    ghCompatibleHeaderId: true,
    ghCodeBlocks: true,
    ghMentions: true,
    tables: true
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    fs.readdir('./articles', (err, files) => {
        if (err) {
            console.log(err);
        } else {
            console.log(files)
            res.render('index', { articles: files })
        }
    });
});

app.get('/articles/:article', (req, res) => {
    fs.readdir('./articles', (err, files) => {
        if (err) {
            console.log(err);
        } else {
            if(req.params.article) {
                if(!files.includes(req.params.article + '.md')) return res.send({ error: 'Article not found' })
                let article = fs.readFileSync('./articles/' + req.params.article + '.md', 'utf8')
                let output = converter.makeHtml(article)
                res.render('articles', { output })
            } else {
                res.redirect('/')
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});