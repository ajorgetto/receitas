const express = require('express');
const path = require('path');
const consign = require('consign');
const bodyParser = require('body-parser');
const session = require('express-session');
const CadastroDAO = require("./DAO/cadastroDAO");
const CardapioDAO = require("./DAO/cardapioDAO");
const banco = require('./repository/database');
const crypto = require('crypto')


const app = express();

const db = new banco();
const cadastroDAO = new CadastroDAO();

consign().include('mvc/controllers').into(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'mvc', 'views', 'public'));
app.use(express.static(path.join(__dirname, 'mvc', 'views', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandomSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};
app.use(session({
    secret: generateRandomSecret(),
    resave: false,
    saveUninitialized: true
}));


app.listen(3000, () => console.log("Online Server On Port 3000"));

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.redirect('/error');
    }

    try {
        const user = await db.verificarCredenciais(email, senha);
        if (user) {
            // Set session variables
            req.session.email = user.email_usuario;
            req.session.id_usuario = user.id_usuario;
            req.session.nivel_usuario = user.nivel_usuario;
            console.log(req.session.id_usuario); 
            console.log(req.session.email); 
            
            if (user.nivel_usuario === 1) {
                res.redirect('/admin');
            } else {
                req.session.email = user.email_usuario;
                res.render('addreceita', { idUsuario: user.id_usuario }); 
            }
            return; 
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        res.redirect('/error');
    }
});

app.get("/receita/lista", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const cardapioDAO = new CardapioDAO();
    const lista_receitas = await cardapioDAO.consultarReceitas();
    res.render("todas", { receitas: lista_receitas });
});

app.get("/error", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/public", "errou.html"));
});
app.get("/users", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve(__dirname, "./mvc/views/ctrldev", "usuarios.html"));
});
app.get("/admin", (req, res) => {
    if (req.session && req.session.email && req.session.nivel_usuario === 1) {
        res.sendFile(path.resolve("mvc/views/ctrldev/dashboard.html"));
    } else {
        res.redirect("/pagina/login");
    }
});


app.get('/api/dados-dashboard', async (req, res) => {
    try {
        // Busque os dados relevantes do banco de dados
        const totalReceitas = await db.countTotalReceitas();
        const receitasFit = await db.countReceitasPorCategoria('Receitas Fit');
        const receitasVo = await db.countReceitasPorCategoria('Receitas de vó');
        const receitasLarica = await db.countReceitasPorCategoria('Receitas da larica');
        const totalUsers = await db.countTotalUsers();

        // Envie os dados como resposta
        res.json({
            totalReceitas,
            receitasFit,
            receitasVo,
            receitasLarica,
            totalUsers
        });
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
});
app.get('/destroi', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.status(500).send('Erro interno ao fazer logout');
            
        }else{
            res.redirect('/receita/lista');
        }
    })
})
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await db.selectCadastro2(); // Obtém a lista de usuários do DAO
        res.json(usuarios); // Retorna a lista de usuários como JSON
    } catch (error) {
        console.error('Erro ao obter lista de usuários:', error);
        res.status(500).send('Erro ao obter lista de usuários'); // Retorna um erro 500 em caso de falha
    }
});
module.exports = app;
