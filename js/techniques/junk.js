/**
 * Generador de código basura (dead code)
 */
import Random from '../utils/random.js';

const Junk = {
    /**
     * Genera una variable basura con asignación
     */
    fakeVariable() {
        const varName = Random.varName();
        const values = [
            `'${Random.junkString(10)}'`,
            Random.number(1, 9999),
            'null',
            'true',
            'false',
            `array(${Random.number(1, 10)},${Random.number(1, 10)})`,
            `base64_decode('${btoa(Random.junkString(8))}')`
        ];

        return `${varName}=${Random.pick(values)};`;
    },

    /**
     * Genera una función que no hace nada útil
     */
    fakeFunction() {
        const funcName = Random.funcName();
        const varA = Random.varName();
        const varB = Random.varName();

        const bodies = [
            `return ${varA}+${varB};`,
            `return md5(${varA});`,
            `return strlen(${varA});`,
            `return base64_encode(${varA});`,
            `return str_rot13(${varA});`,
            `if(${varA}){return ${varB};}return null;`
        ];

        return `function ${funcName}(${varA},${varB}=null){${Random.pick(bodies)}}`;
    },

    /**
     * Genera un if que nunca se ejecuta
     */
    fakeIf() {
        const varName = Random.varName();
        const junkCode = this.fakeVariable() + this.fakeVariable();

        const conditions = [
            '(false)',
            '(0)',
            '(1>2)',
            '(null)',
            '(""=="x")',
            `(md5('a')=='b')`
        ];

        return `if${Random.pick(conditions)}{${junkCode}}`;
    },

    /**
     * Genera un loop que no hace nada
     */
    fakeLoop() {
        const varI = Random.varName();
        const varX = Random.varName();

        const loops = [
            `for(${varI}=0;${varI}<0;${varI}++){${this.fakeVariable()}}`,
            `while(false){${this.fakeVariable()}}`,
            `foreach(array() as ${varX}){${this.fakeVariable()}}`
        ];

        return Random.pick(loops);
    },

    /**
     * Genera un try-catch vacío
     */
    fakeTryCatch() {
        const varE = Random.varName();
        return `try{${this.fakeVariable()}}catch(Exception ${varE}){}`;
    },

    /**
     * Genera un bloque de código basura mixto
     */
    generateBlock(size = 3) {
        const generators = [
            () => this.fakeVariable(),
            () => this.fakeFunction(),
            () => this.fakeIf(),
            () => this.fakeLoop()
        ];

        let block = '';
        for (let i = 0; i < size; i++) {
            block += Random.pick(generators)();
        }

        return block;
    },

    /**
     * Inserta código basura en posiciones random del código
     */
    inject(code, amount = 3) {
        const statements = code.split(';').filter(s => s.trim());

        if (statements.length < 2) {
            return this.generateBlock(amount) + code;
        }

        // Insertar código basura en posiciones random
        for (let i = 0; i < amount; i++) {
            const position = Random.number(0, statements.length - 1);
            const junk = this.generateBlock(1);
            statements.splice(position, 0, junk.replace(/;$/, ''));
        }

        return statements.join(';') + ';';
    },

    /**
     * Genera comentarios falsos para confundir
     */
    fakeComments() {
        const comments = [
            '/* Decryption key: ' + Random.fakeHash() + ' */',
            '// TODO: Remove before production',
            '/* License: ' + Random.junkString(20) + ' */',
            '// DEBUG MODE ENABLED',
            '/* Encoded with NexusEncrypt v' + Random.number(1, 9) + '.' + Random.number(0, 9) + ' */'
        ];

        return Random.pick(comments);
    }
};

export default Junk;
