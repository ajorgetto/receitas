const Database = require('../repository/database');
const Receita = require('../mvc/models/cardapioModel');

class ReceitaDAO {
    #conexao

    constructor(){
        this.#conexao = new Database()
    }

    async consultarReceitas() {
        const lista_receitas = [];
        const receitas = await this.#conexao.selecionarReceitas();

        if (receitas) {
            for (const receita of receitas) {
                const objReceita = new Receita();
                objReceita.id = receita.id_cardapio;
                objReceita.nome = receita.nome;
                objReceita.categoria = receita.categoria;
                objReceita.imagem = receita.imagem;
                objReceita.ingredientes = receita.ingredientes;
                objReceita.modo_preparo = receita.modo_preparo;
                objReceita.tempo_preparo = receita.tempo_preparo;
                objReceita.usuarios = receita.usuarios_idusuario;
                lista_receitas.push(objReceita.toJson());
            }
        }

        return lista_receitas;
    }

    async consultarReceitasId(id) {
        const receita = await this.#conexao.selecionarReceitasId(id);
        

        const objReceita = new Receita();

        objReceita.id = receita[0].id_cardapio;
        objReceita.nome = receita[0].nome;
        objReceita.categoria = receita[0].categoria;
        objReceita.imagem = receita[0].imagem;
        objReceita.ingredientes = receita[0].ingredientes;
        objReceita.modo_preparo = receita[0].modo_preparo;
        objReceita.tempo_preparo = receita[0].tempo_preparo;
        objReceita.usuarios = receita[0].usuarios_idusuario;

        return objReceita.toJson();
    }

    async registrarReceita(nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios) {
        const receita = new Receita();
    
        receita.nome = nome;
        receita.categoria = categoria;
        receita.imagem = imagem;
        receita.ingredientes = ingredientes;
        receita.modopreparo = modo_preparo;
        receita.tempoPreparo = tempo_preparo;
        receita.usuarios = usuarios;
    
        await this.#conexao.insertReceita(
            receita.nome,
            receita.categoria,
            receita.imagem,
            receita.ingredientes,
            receita.modopreparo,
            receita.tempoPreparo,
            receita.usuarios
        );
    }
    

    async atualizarReceita(id, nome, categoria, imagem, ingredientes, modo_preparo, tempo_preparo, usuarios) {
        const receita = new Receita();

        receita.id = id;
        receita.nome = nome;
        receita.categoria = categoria;
        receita.imagem = imagem;
        receita.ingredientes = ingredientes;
        receita.modo_preparo = modo_preparo;
        receita.tempo_preparo = tempo_preparo;
        receita.usuarios = usuarios;

        const result = await this.#conexao.updateReceita(receita.nome,receita.categoria,  receita.imagem ,  receita.ingredientes,receita.modo_preparo,receita.tempo_preparo,receita.usuarios,receita.id)
        return result[0];
    }

    async apagarReceita(id) {

        const result = await this.#conexao.deleteReceita(sql);
        return result[0];
    }
    async consultarReceitasPorCategoria(categoria) {
        const lista_receitas = [];
        const receitas = await this.#conexao.selecionarReceitasPorCategoria(categoria);

        if (receitas) {
            for (const receita of receitas) {
                const objReceita = new Receita();
                objReceita.id = receita.id_cardapio;
                objReceita.nome = receita.nome;
                objReceita.categoria = receita.categoria;
                objReceita.imagem = receita.imagem;
                objReceita.ingredientes = receita.ingredientes;
                objReceita.modo_preparo = receita.modo_preparo;
                objReceita.tempo_preparo = receita.tempo_preparo;
                objReceita.usuarios = receita.usuarios_idusuario;
                lista_receitas.push(objReceita.toJson());
            }
        }

        return lista_receitas;
    }
    
}

module.exports = ReceitaDAO;
