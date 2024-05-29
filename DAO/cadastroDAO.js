const Cadastro = require("../mvc/models/cadastroModel");
const Database = require("../repository/database");

class CadastroDAO {

    #conexao

    constructor() {
        this.#conexao = new Database();
    }

    async consultarCadastro() {

        const list_cadastros = []
        const query = await this.#conexao.selectCadastro()

        for (let index = 0; index < query.length; index++) {

            const cadastro = new Cadastro()

            cadastro.id = query[index].id_usuario
            cadastro.nome = query[index].nome_usuario
            cadastro.foto = query[index].foto_usuario
            cadastro.email = query[index].email_usuario
            cadastro.senha = query[index].senha_usuario

            list_cadastros.push(cadastro.toJson())
        }
        return list_cadastros
    }
    async cadastrar(nome, foto, email, senha) {
        const cadastro = new Cadastro(nome, foto, email, senha);
        console.log("Cadastro criado:", cadastro.toJson()); 
    
        const sql = await this.#conexao.insertCadastro({
            nome: cadastro.nomeUsuario,
            foto: cadastro.fotoUsuario,
            email: cadastro.emailUsuario,
            senha: cadastro.senhaUsuario,
        });
                
        return sql.insertId;
    }
    // async verificarCredenciais(email) {
    //     const query = 'SELECT * FROM usuarios WHERE email_usuario = ?';
    //     const [rows] = await db.execute(query, [email]);
      
    //     if (rows.length > 0) {
    //       return rows[0]; 
    //     } else {
    //       return null;
    //     }
    //   }
      
      
    
}

module.exports = CadastroDAO
