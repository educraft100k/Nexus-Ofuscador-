/**
 * Técnicas de fragmentación de strings
 */
import Helpers from '../utils/helpers.js';
import Random from '../utils/random.js';

const Strings = {
    /**
     * Encuentra todos los strings en el código
     */
    findStrings(code) {
        const strings = [];
        // Strings con comillas dobles
        const doubleQuote = /"([^"\\]|\\.)*"/g;
        // Strings con comillas simples
        const singleQuote = /'([^'\\]|\\.)*'/g;

        let match;
        while ((match = doubleQuote.exec(code)) !== null) {
            if (match[0].length > 3) { // Solo strings de más de 1 caracter
                strings.push({
                    original: match[0],
                    content: match[0].slice(1, -1),
                    type: 'double',
                    index: match.index
                });
            }
        }

        while ((match = singleQuote.exec(code)) !== null) {
            if (match[0].length > 3) {
                strings.push({
                    original: match[0],
                    content: match[0].slice(1, -1),
                    type: 'single',
                    index: match.index
                });
            }
        }

        return strings;
    },

    /**
     * Fragmenta un string en concatenación de partes
     */
    fragment(str, parts = 3) {
        if (str.length < parts) parts = str.length;

        const partLength = Math.ceil(str.length / parts);
        const fragments = [];

        for (let i = 0; i < str.length; i += partLength) {
            fragments.push(`'${str.slice(i, i + partLength)}'`);
        }

        return fragments.join('.');
    },

    /**
     * Convierte string a chr() concatenados
     */
    toChr(str) {
        return Helpers.stringToChr(str);
    },

    /**
     * Convierte a hex
     */
    toHex(str) {
        return Helpers.stringToHex(str);
    },

    /**
     * Convierte a base64 con decode en runtime
     */
    toBase64Runtime(str) {
        const encoded = Helpers.toBase64(str);
        return `base64_decode('${encoded}')`;
    },

    /**
     * Mezcla de técnicas random
     */
    randomTechnique(str) {
        const techniques = [
            () => this.fragment(str, Random.number(2, 5)),
            () => this.toChr(str),
            () => this.toHex(str),
            () => this.toBase64Runtime(str)
        ];

        return Random.pick(techniques)();
    },

    /**
     * Ofusca todos los strings en el código
     */
    obfuscate(code, technique = 'random') {
        const strings = this.findStrings(code);
        let result = code;

        // Ordenar por índice descendente para reemplazar de atrás hacia adelante
        strings.sort((a, b) => b.index - a.index);

        for (const str of strings) {
            let replacement;

            switch (technique) {
                case 'fragment':
                    replacement = this.fragment(str.content);
                    break;
                case 'chr':
                    replacement = this.toChr(str.content);
                    break;
                case 'hex':
                    replacement = this.toHex(str.content);
                    break;
                case 'base64':
                    replacement = this.toBase64Runtime(str.content);
                    break;
                case 'random':
                default:
                    replacement = this.randomTechnique(str.content);
            }

            result = result.substring(0, str.index) +
                     replacement +
                     result.substring(str.index + str.original.length);
        }

        return result;
    }
};

export default Strings;
