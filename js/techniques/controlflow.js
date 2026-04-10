/**
 * Técnicas de ofuscación de flujo de control
 */
import Random from '../utils/random.js';

const ControlFlow = {
    /**
     * Envuelve código en un switch confuso
     */
    wrapInSwitch(code) {
        const varState = Random.varName();
        const statements = code.split(';').filter(s => s.trim());

        if (statements.length < 2) {
            return code; // No tiene sentido con poco código
        }

        // Generar orden random de cases
        const order = [];
        for (let i = 0; i < statements.length; i++) {
            order.push(i);
        }

        // Mezclar el orden
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }

        // Generar el switch
        let result = `${varState}=0;`;
        result += `while(${varState}!==${statements.length}){`;
        result += `switch(${varState}){`;

        for (let i = 0; i < statements.length; i++) {
            const caseNum = order.indexOf(i);
            const nextState = i + 1;
            result += `case ${caseNum}:${statements[i]};${varState}=${order.indexOf(nextState) === -1 ? statements.length : order.indexOf(nextState)};break;`;
        }

        result += `}}`;

        return result;
    },

    /**
     * Añade condiciones siempre verdaderas
     */
    addTrueConditions(code) {
        const trueConditions = [
            '(1)',
            '(true)',
            '(1==1)',
            '(2>1)',
            '(!false)',
            '(0!=1)',
            '(""=="")',
            '(null==null)',
            '(1===1)'
        ];

        const varCheck = Random.varName();
        const condition = Random.pick(trueConditions);

        return `if${condition}{${code}}`;
    },

    /**
     * Añade condiciones siempre falsas con código basura
     */
    addFalseConditions(code, junkCode = 'die();') {
        const falseConditions = [
            '(0)',
            '(false)',
            '(1==2)',
            '(1>2)',
            '(!true)',
            '(0!=0)'
        ];

        const condition = Random.pick(falseConditions);
        const junk = `if${condition}{${junkCode}}`;

        // Insertar el código basura en posición random
        if (Math.random() > 0.5) {
            return junk + code;
        } else {
            return code + junk;
        }
    },

    /**
     * Crea un laberinto de gotos (PHP 5.3+)
     */
    createGotoMaze(code) {
        const statements = code.split(';').filter(s => s.trim());

        if (statements.length < 3) {
            return code;
        }

        // Generar labels
        const labels = statements.map(() => `_${Random.junkString(5)}`);

        let result = `goto ${labels[0]};`;

        // Mezclar el orden de las declaraciones
        const indices = [...Array(statements.length).keys()];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Crear el código con gotos
        for (const i of indices) {
            const nextIndex = statements.indexOf(statements[i]) + 1;
            const nextLabel = nextIndex < statements.length ? labels[nextIndex] : '_end';

            result += `${labels[i]}:${statements[i]};goto ${nextLabel};`;
        }

        result += `_end:`;

        return result;
    },

    /**
     * Proceso completo de ofuscación de control flow
     */
    obfuscate(code, level = 'medium') {
        let result = code;

        switch (level) {
            case 'light':
                result = this.addTrueConditions(result);
                break;
            case 'medium':
                result = this.addTrueConditions(result);
                result = this.addFalseConditions(result);
                break;
            case 'heavy':
                result = this.wrapInSwitch(result);
                result = this.addFalseConditions(result);
                break;
            case 'insane':
                result = this.createGotoMaze(result);
                result = this.addFalseConditions(result);
                result = this.addTrueConditions(result);
                break;
        }

        return result;
    }
};

export default ControlFlow;
