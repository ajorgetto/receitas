const CardapioDAO = require("../../DAO/cardapioDAO.js")
const path = require("path")
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs').promises

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'views', 'public', 'images', 'upload'));
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);

        const nomeArquivo = crypto.createHash('md5').update(file.originalname + Date.now().toString()).digest('hex') + extensao
        cb(null, nomeArquivo)
    }
});

    const upload = multer({ storage: storage });
    const cardapioDAO = new CardapioDAO()
    
module.exports = (app) => {

    app.get("/getReceitas", async (req, res) => {
   
            
        res.setHeader("Access-Control-Allow-Origin","*")
        res.sendFile(path.resolve("mvc/views/"))
    })
    
     app.post("/registrarreceita", upload.fields([{ name: 'imagemreceita', maxCount: 1 }]), async (req, res) => {
        try {
            const extensao1 = path.extname(req.files['imagemreceita'][0].originalname);
    
            const nomeArquivo1 = crypto.createHash('md5').update(req.files['imagemreceita'][0].originalname + Date.now().toString()).digest('hex') + extensao1;
    
            const caminhoDestino1 = path.join(__dirname, '..', 'views', 'public', 'images', 'upload', nomeArquivo1);
    
            await fs.rename(req.files['imagemreceita'][0].path, caminhoDestino1);
    
            console.log('Upload bem-sucedido');
    
            const {
              idreceita: id,
              nomereceita: nome,
              categoria : categoria,
              modopreparo : modopreparo,
              ingredientes : ingredientes,
              tempohoras : tempohoras,
              idusuario : usuario
            } = req.body;
    
           
            const nomeArquivo1SemPath = path.basename(caminhoDestino1);
    
                let status;
                if(!id){
                    status = await cardapioDAO.registrarReceita(nome, categoria, nomeArquivo1, ingredientes, modopreparo, tempohoras, usuario);
                } else{
                    status = await cardapioDAO.atualizarReceita(id,nome, categoria, nomeArquivo1, ingredientes, modopreparo, tempohoras,usuario)
                }
    
                const lista_receitas = await cardapioDAO.consultarReceitas();
                res.redirect('/receita/lista');
            } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao realizar o upload.');
        }
    });
     app.get("/pagina/receita", (req, res) => {
         res.setHeader("Access-Control-Allow-Origin","*")
         
         res.render('addreceita', { req: req });
     })
 
   
    
    
    app.get("/receita",(req,res)=>{
        res.setHeader("Acess-control-Allow-Origin","*")
        res.sendFile(path.resolve("mvc/views/public/addreceita.html"))
    })
    
    app.get("/receita/lista", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cardapioDAO = new CardapioDAO();
        const lista_receitas = await cardapioDAO.consultarReceitas();
        res.render("todas", { receitas: lista_receitas, req: req }); // Passando req como uma variável
    });
    
    
    app.get("/receita/alterar/:id", async (req, res) => {
        const cardapioDAO = new CardapioDAO()

        const dtreceita = await cardapioDAO.consultarReceitasId(req.params.id)

        res.render("receita/upreceita", { receita: dtreceita  })
    })
    
    app.delete("/receita/apagar/:id", async (req,res) =>{
        const cardapioDAO = new CardapioDAO();
        res.setHeader("Access-Control-Allow-Origin","*")
    
        res.json(await cardapioDAO.apagarReceita(req.params.id))

    })

    app.get("/receita/larica", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cardapioDAO = new CardapioDAO();
        const receitasLarica = await cardapioDAO.consultarReceitasPorCategoria('Receitas da larica');
        res.render("larica", { receitas: receitasLarica, req: req }); // Passando req como uma variável
    });
    
    app.get("/receita/fit", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cardapioDAO = new CardapioDAO();
        const receitasFit = await cardapioDAO.consultarReceitasPorCategoria('Receitas fit');
        res.render("fit", { receitas: receitasFit, req: req }); // Passando req como uma variável
    });
    
    app.get("/receita/vo", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const cardapioDAO = new CardapioDAO();
        const receitasVo = await cardapioDAO.consultarReceitasPorCategoria('Receitas de vó');
        res.render("vo", { receitas: receitasVo, req: req }); // Passando req como uma variável
    });
    

}
