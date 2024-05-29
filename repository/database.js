const mysql = require('mysql2')
 
class Database{
 
    #connection
 
    constructor() {
        // Configuração do banco
        this.#connection = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "receitas2",
        }).promise();
    }

    async selecionarReceitas() {
        const receitasData = await this.#connection.query("SELECT * FROM receitas;");
        return receitasData[0];
    }

    async insertReceita(nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios){
        const sql = `
            INSERT INTO cardapio (nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios_id_usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios];
        const [result] = await this.#connection.execute(sql, values);
        return result;
    }
    

    async selecionarReceitas() {
        const receitasData = await this.#connection.query("select * from cardapio")
        return receitasData[0]
    }

    async selecionarReceitasId(id) {
        const receitasData = await this.#connection.query("select * from cardapio where id_cardapio =" + id)
        return receitasData[0]
    }

    async deleteReceita(id) {
        const sql =
            `
        delete from cardapio
        where id_cardapio = ${id}`

        const dt = await this.#connection.execute(sql)
        return dt[0]
    }

    async updateReceita(nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios) {
        const sql = `update cardapio 
        set nome = "${nome}",
            categoria = "${categoria}",
            imagem = "${imagem}",
            ingredientes = "${ingredientes}",
            modo_preparo = ${modo_preparo}   ,
            tempo_preparo = "${tempo_preparo}",
            usuario = "${usuarios}"
         `

        const dt = await this.#connection.execute(sql)
        return dt[0]
    }
                                    //   Cadastro de usuario
    async selectCadastro(){
        const query = await this.#connection.query("select * from usuarios")
        return query[0]
    }
    async insertCadastro(param) {
        const sql = `INSERT INTO usuarios (nome_usuario, foto_usuario, email_usuario, senha_usuario) 
                     VALUES ('${param.nome}', '${param.foto}', '${param.email}', '${param.senha}')`;
        const query = await this.#connection.execute(sql);
        return query[0];
    }

    
    async selecionarReceitasPorCategoria(categoria) {
        const sql = "SELECT * FROM cardapio WHERE categoria = ?";
        const [result] = await this.#connection.execute(sql, [categoria]);
        return result;
    }
    async verificarCredenciais(email, senha) {
        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios');
        }
    
        try {
            const sql = 'SELECT * FROM usuarios WHERE email_usuario = ? AND senha_usuario = ?';
            const [rows, fields] = await this.#connection.execute(sql, [email, senha]);
            
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao verificar login:', error);
            throw error;
        }
    }
    
}

 
module.exports = Database