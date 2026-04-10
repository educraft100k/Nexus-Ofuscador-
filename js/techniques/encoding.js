/**
 * Técnicas de encoding: base64, hex, rot13, capas múltiples
 */
import Helpers from '../utils/helpers.js';
import Random from '../utils/random.js';

const Encoding = {
    /**
     * Envuelve código en eval(base64_decode())
     */
    base64Layer(code) {
        const encoded = Helpers.toBase64(code);
        return `eval(base64_decode('${encoded}'));`;
    },

    /**
     * Envuelve código en eval(gzinflate(base64_decode()))
     * Nota: gzinflate requiere que el código esté comprimido,
     * simulamos con base64 doble
     */
    gzLayer(code) {
        const encoded = Helpers.toBase64(Helpers.toBase64(code));
        return `eval(base64_decode(base64_decode('${encoded}')));`;
    },

    /**
     * ROT13 + base64
     */
    rot13Layer(code) {
        const rotted = Helpers.rot13(code);
        const encoded = Helpers.toBase64(rotted);
        return `eval(str_rot13(base64_decode('${encoded}')));`;
    },

    /**
     * Capa con funciones como variables (no obvio)
     */
    hiddenFuncLayer(code) {
        const encoded = Helpers.toBase64(code);
        const varDecode = Random.varName();
        const varEval = Random.varName();
        const varData = Random.varName();

        return `${varDecode}='base'.'64_'.'dec'.'ode';` +
               `${varEval}='ev'.'al';` +
               `${varData}='${encoded}';` +
               `${varEval}(${varDecode}(${varData}));`;
    },

    /**
     * Múltiples capas de encoding
     */
    multiLayer(code, layers = 3) {
        let result = code;
        const techniques = [
            this.base64Layer.bind(this),
            this.rot13Layer.bind(this),
            this.hiddenFuncLayer.bind(this)
        ];

        for (let i = 0; i < layers; i++) {
            const technique = Random.pick(techniques);
            result = technique(result);
        }

        return result;
    },

    /**
     * Encoding con XOR simple (key estática)
     */
    xorLayer(code) {
        const key = Random.junkString(8);
        let encoded = '';

        for (let i = 0; i < code.length; i++) {
            encoded += String.fromCharCode(
                code.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }

        const encodedB64 = Helpers.toBase64(encoded);
        const varKey = Random.varName();
        const varData = Random.varName();
        const varResult = Random.varName();

        return `${varKey}='${key}';` +
               `${varData}=base64_decode('${encodedB64}');` +
               `${varResult}='';` +
               `for($i=0;$i<strlen(${varData});$i++){` +
               `${varResult}.=chr(ord(${varData}[$i])^ord(${varKey}[$i%strlen(${varKey})]));` +
               `}` +
               `eval(${varResult});`;
    }
};

export default Encoding;
