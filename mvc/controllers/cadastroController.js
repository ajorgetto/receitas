const express = require('express');
const path = require('path');
const CadastroDAO = require('../../DAO/cadastroDAO');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

// Configuração de middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'views', 'public')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'views', 'public', 'images', 'upload'));
  },
  filename: function (req, file, cb) {
    const extensao = path.extname(file.originalname);
    const nomeArquivo = crypto.createHash('md5').update(file.originalname + Date.now().toString()).digest('hex') + extensao;
    cb(null, nomeArquivo);
  },
});

const cadastroDAO = new CadastroDAO();
const upload = multer({ storage: storage });

module.exports = (app) => {
  app.post('/cadastro', upload.single('foto'), async (req, res) => {
    try {
      if (!req.file) {
        throw new Error('Erro ao realizar o upload. É necessário selecionar uma imagem');
      }

      const extensao = path.extname(req.file.originalname);
      const nomeArquivo = crypto.createHash('md5').update(req.file.originalname + Date.now().toString()).digest('hex') + extensao;
      const caminhoOrigem = req.file.path;
      const caminhoDestino = path.join(__dirname, '..', 'views', 'public', 'images', 'upload', nomeArquivo);

      await fs.rename(caminhoOrigem, caminhoDestino);

      console.log('Upload bem-sucedido');

      const { txtid: id, nome, email, senha } = req.body;
      let status;

      if (!id) {
        status = await cadastroDAO.cadastrar(nome, nomeArquivo, email, senha);
      } else {
        status = await cadastroDAO.atualizar(nome, nomeArquivo, email, senha, id);
      }

      res.sendFile(path.resolve('./mvc/views/public/addreceita.html'));
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message || 'Erro interno do servidor');
    }
  });

  app.get("/cadastro", async (req, res) => {
    const cadastroDAO = new CadastroDAO();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(await cadastroDAO.consultarCadastro());
  });

  app.get("/pagina/cadastro", (req, res) => {
    res.sendFile(path.resolve('mvc/views/public/cadastro.html'));
  });

  app.get("/pagina/login", (req, res) => {
    res.sendFile(path.resolve('mvc/views/public/login.html'));
  });

  // app.post('/login', (req, res) => {
  //   console.log(req.body);
  //   const { email, senha } = req.body;

  //   if (!email || !senha) {
  //     return res.status(400).send('Email e senha são obrigatórios');
  //   }

  //   const query = 'SELECT * FROM users WHERE email_usuario = ?';
  //   db.query(query, [email], (err, results) => {
  //     if (err) {
  //       return res.status(500).send('Erro ao consultar o banco de dados');
  //     }

  //     if (results.length > 0) {
  //       const user = results[0];
  //       bcrypt.compare(senha, user.senha_usuario, (err, isMatch) => {
  //         if (err) {
  //           return res.status(500).send('Erro ao verificar a senha');
  //         }

  //         if (isMatch) {
  //           res.send('Login bem-sucedido');
  //         } else {
  //           res.status(401).send('Email ou senha incorretos');
  //         }
  //       });
  //     } else {
  //       res.status(401).send('Email ou senha incorretos');
  //     }
  //   });
  // });
}
  
