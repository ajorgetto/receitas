class Receita {

  
    #id;
    #nome;
    #categoria;
    #imagem;
    #ingredientes;
    #modo_preparo;
    #tempoPreparo;
    #usuarios;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#nome = value;
    }

    get categoria() {
        return this.#categoria;
    }
    set categoria(value) {
        this.#categoria = value;
    }

    get imagem() {
        return this.#imagem;
    }
    set imagem(value) {
        this.#imagem = value;
    }

    get ingredientes() {
        return this.#ingredientes;
    }
    set ingredientes(value) {
        this.#ingredientes = value;
    }

    get modo_preparo() {
        return this.#modo_preparo;
    }
    set modo_preparo(value) {
        this.#modo_preparo = value;
    }

    get tempoPreparo() {
        return this.#tempoPreparo;
    }
    set tempoPreparo(value) {
        this.#tempoPreparo = value;
    }

    get usuarios() {
        return this.#usuarios;
    }
    set usuarios(value) {
        this.#usuarios = value;
    }

    constructor(nome, categoria, imagem, ingredientes, modo_preparo, tempoPreparo) {
      this.nome = nome;
      this.categoria = categoria;
      this.imagem = imagem;
      this.ingredientes = ingredientes;
      this.modo_preparo = modo_preparo;
      this.tempoPreparo = tempoPreparo;
    }

    toJson() {
        return {
            id: this.#id,
            nome: this.#nome,
            categoria: this.#categoria,
            imagem: this.#imagem,
            ingredientes: this.#ingredientes,
            modo_preparo: this.#modo_preparo,
            tempoPreparo: this.#tempoPreparo,
            usuarios: this.#usuarios
        };
    }

}

  
  
  
  module.exports = Receita;
  