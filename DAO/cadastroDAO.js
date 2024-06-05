const Cadastro = require("../mvc/models/cadastroModel");
const Database = require("../repository/database");

class CadastroDAO {

    #conexao

    constructor() {
        this.#conexao = new Database();
    }

    async consultarCadastroID(id) {
        const query = await this.#conexao.selectCadastroPorId(id);
        if (!query) {
            throw new Error('Usuário não encontrado');
        }

        const cadastro = new Cadastro();
        cadastro.id = query.id_usuario;
        cadastro.nome = query.nome_usuario;
        cadastro.foto = query.foto_usuario;
        cadastro.email = query.email_usuario;
        cadastro.senha = query.senha_usuario;

        return cadastro.toJson();
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
            console.log(list_cadastros)
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
    async atualizarCadastro(nivel,id){

        const user = new Cadastro()
    
        user.id = id

        user.nivel=nivel
    
        const dt = await this.#conexao.updateUser(user.nivel,user.id)
        return dt
    }
    async apagarCadastro(id){
        const dados =  await this.#conexao.deleteCadastro(id)
        return dados
       }
      
    
}

module.exports = CadastroDAO
