class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.estadoErro = false;
        this.memTemp = '';
        this.memoria = 0;
        this.iniciouSegundo = false;
        this.op = {
            NOP: 0,
            SUM: 1,
            SUB: 2,
            MULT: 3,
            DIV: 4
        };
        this.opAtual = this.op.NOP;
        this.opSelecionada = null; // Guarda a operação selecionada
    }

    // Retorna valor do visor
    mostraVisor() {
        return this.nrVisor;
    }

    // Recebe dígito
    recebeDigito(dig) {
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (this.nrVisor.length == 10) return;
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ? '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Define a operação atual
    defineOperacao(op) {
        if (this.estadoErro) return;
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '/':
                this.opAtual = this.op.DIV;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
        }
        this.memTemp = this.nrVisor;
        this.opSelecionada = op; // Guarda a operação selecionada
    }

    // Executa operação: tecla igual
    igual() {
        if (this.estadoErro) return;
        if (this.opAtual == this.op.NOP) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.SUM:
                resultado = num1 + num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.MULT:
                resultado = num1 * num2;
                break;
            case this.op.DIV:
                if (num2 == 0) {
                    this.estadoErro = true;
                    this.nrVisor = 'ERRO!';
                    return;
                }
                resultado = num1 / num2;
                break;
        }
        this.opAtual = this.op.NOP;
        this.ptDecimal = false;
        this.memTemp = '';
        this.iniciouSegundo = false;
        // Arredonda o resultado para 10 casas decimais
        this.nrVisor = resultado.toFixed(10);
        this.opSelecionada = null; // Reseta a operação selecionada
    }

    // Tecla C - reinicia tudo, exceto memória
    teclaC() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
        this.opSelecionada = null; // Reseta a operação selecionada
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (this.estadoErro) return;
        this.memoria = 0;
    }

    // Alterna o sinal do número no visor
    teclaMaisMenos() {
        if (this.estadoErro) return;
        if (this.nrVisor !== '0') {
            this.nrVisor = String(-parseFloat(this.nrVisor));
        }
    }

    // Calcula a raiz quadrada do número no visor
    teclaRaizQuadrada() {
        if (this.estadoErro) return;
        let num = parseFloat(this.nrVisor);
        if (num >= 0) {
            let raiz = Math.sqrt(num);
            if (Number.isInteger(raiz)) {
                this.nrVisor = String(raiz);
            } else {
                this.estadoErro = true;
                this.nrVisor = 'ERRO!';
            }
        } else {
            this.estadoErro = true;
            this.nrVisor = 'ERRO!';
        }
    }

    // Calcula o inverso do número no visor
    teclaInverso() {
        if (this.estadoErro) return;
        let num = parseFloat(this.nrVisor);
        if (num !== 0) {
            this.nrVisor = String((1 / num).toFixed(10));
        } else {
            this.estadoErro = true;
            this.nrVisor = 'ERRO!';
        }
    }
}

// ===================================================================
//  REAÇÃO A EVENTOS DO MOUSE
// ===================================================================

// ATUALIZA O VALOR NO VISOR
let mostraVisor = () => {
    document.getElementById('visor-id').innerHTML = calculadora.nrVisor;
    // Atualiza a aparência das teclas de operação
    atualizarTeclasOperacao();
}

// RECEBE UM DÍGITO (OU PONTO)
let digito = (dig) => {
    calculadora.recebeDigito(dig);
    mostraVisor();
}

// RECEBE A OPERAÇÃO ATUAL
let defOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        igual();
        mostraVisor();
    }
    calculadora.defineOperacao(op);
    mostraVisor();
}

// CALCULA A OPERAÇÃO
let igual = () => {
    calculadora.igual();
    mostraVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    mostraVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    mostraVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
    mostraVisor();
}

// Alterna o sinal do número no visor
let teclaMaisMenos = () => {
    calculadora.teclaMaisMenos();
    mostraVisor();
}

// Calcula a raiz quadrada do número no visor
let teclaRaizQuadrada = () => {
    calculadora.teclaRaizQuadrada();
    mostraVisor();
}

// Calcula o inverso do número no visor
let teclaInverso = () => {
    calculadora.teclaInverso();
    mostraVisor();
}


let atualizarTeclasOperacao = () => {

    document.querySelectorAll('.tecla-operacao').forEach((element) => {
        element.style.backgroundColor = '';
    });
    if (calculadora.opSelecionada) {
        document.getElementById(`op-${calculadora.opSelecionada}`).style.backgroundColor = 'yellow';
    }
}

// ===================================================================
//  INÍCIO DO PROCESSAMENTO
// ===================================================================

let calculadora = new Calculadora();
