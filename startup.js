const express = require('express')
const path = require('path');
const consign = require('consign')
const bodyParser = require('body-parser')
const CadastroDAO = require("./DAO/cadastroDAO");
const CardapioDAO = require("./DAO/cardapioDAO")
const banco = require('./repository/database');

 
const app = express()

const db = new banco();
const cadastroDAO = new CadastroDAO;
 
consign().include('mvc/controllers').into(app)
app.set('view engine', 'ejs')
app.set('views','mvc/views/public')
app.use(express.static(path.join(__dirname,'mvc','views', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
 
app.listen(3000, () => console.log("Online Server On Port 3000"))

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.redirect('/error');
    }

    try {
        const user = await db.verificarCredenciais(email, senha);
        if (user) {
            res.redirect('/pagina/receita');
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        res.redirect('/error');
    }
});


app.get("/receita/lista", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    const cardapioDAO = new CardapioDAO()
    const lista_receitas = await cardapioDAO.consultarReceitas()
    res.render("todas", { receitas: lista_receitas })
})
app.get("/error", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/public", "errou.html"));
});



 
module.exports = app
