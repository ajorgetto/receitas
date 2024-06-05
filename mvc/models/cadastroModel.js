class Cadastro {

    #id;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    #nomeUsuario;
    get nomeUsuario() {
        return this.#nomeUsuario;
    }
    set nomeUsuario(value) {
        this.#nomeUsuario = value;
    }
    #fotoUsuario;
    get fotoUsuario() {
        return this.#fotoUsuario;
    }
    set fotoUsuario(value) {
        this.#fotoUsuario = value;
    }

    #emailUsuario;
    get emailUsuario() {
        return this.#emailUsuario;
    }
    set emailUsuario(value) {
        this.#emailUsuario = value;
    }

    #senhaUsuario;
    get senhaUsuario() {
        return this.#senhaUsuario;
    }
    set senhaUsuario(value) {
        this.#senhaUsuario = value;
    }

    constructor(nomeUsuario, fotoUsuario, emailUsuario, senhaUsuario) {
        this.#nomeUsuario = nomeUsuario;
        this.#fotoUsuario = fotoUsuario;
        this.#emailUsuario = emailUsuario;
        this.#senhaUsuario = senhaUsuario;
        
    }

    toJson() {
        return {
            "id": this.#id,
            "nome": this.#nomeUsuario,
            "foto": this.#fotoUsuario,
            "email": this.#emailUsuario,
            "senha": this.#senhaUsuario
            
        };
    }
}

module.exports = Cadastro;