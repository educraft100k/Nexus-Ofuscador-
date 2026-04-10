/**
 * Técnicas anti-tampering (protección contra modificación)
 */
import Random from '../utils/random.js';
import Helpers from '../utils/helpers.js';

const AntiTamper = {
    /**
     * Genera código que verifica el hash MD5 del archivo
     */
    md5Check(code, silent = false) {
        const varHash = Random.varName();
        const varExpected = Random.varName();

        // Calculamos un hash placeholder que se debe reemplazar manualmente
        // o usar un hash del código actual
        const fakeHash = Random.fakeHash();

        const failAction = silent
            ? `${Random.varName()}=null;` // Fallo silencioso
            : `die('Integrity check failed');`;

        const check = `${varExpected}='${fakeHash}';` +
                     `${varHash}=md5(file_get_contents(__FILE__));` +
                     `if(${varHash}!==${varExpected}){${failAction}}`;

        return check + code;
    },

    /**
     * Genera código que verifica el SHA1
     */
    sha1Check(code, silent = false) {
        const varHash = Random.varName();
        const varExpected = Random.varName();
        const fakeHash = Random.fakeHash() + Random.junkString(8); // SHA1 es más largo

        const failAction = silent
            ? `return;`
            : `exit(0);`;

        const check = `${varExpected}='${fakeHash}';` +
                     `${varHash}=sha1(file_get_contents(__FILE__));` +
                     `if(${varHash}!==${varExpected}){${failAction}}`;

        return check + code;
    },

    /**
     * Verifica el tamaño del archivo
     */
    sizeCheck(code, silent = false) {
        const varSize = Random.varName();
        const expectedSize = new Blob([code]).size + Random.number(100, 500); // Aproximado

        const failAction = silent
            ? `${Random.varName()}=false;`
            : `die();`;

        const check = `${varSize}=filesize(__FILE__);` +
                     `if(${varSize}<${expectedSize - 100}||${varSize}>${expectedSize + 100}){${failAction}}`;

        return check + code;
    },

    /**
     * Verifica que ciertas strings existan en el código
     */
    signatureCheck(code, silent = false) {
        const signature = '/*' + Random.junkString(16) + '*/';
        const varContent = Random.varName();

        const failAction = silent
            ? `${Random.varName()}=0;`
            : `die('Invalid signature');`;

        const check = `${varContent}=file_get_contents(__FILE__);` +
                     `if(strpos(${varContent},'${signature}')===false){${failAction}}`;

        return signature + check + code;
    },

    /**
     * Verifica que el archivo no haya sido formateado/beautified
     */
    formatCheck(code, silent = false) {
        const varContent = Random.varName();
        const varLines = Random.varName();

        // Si el código tiene muchas líneas, probablemente fue formateado
        const maxLines = 10;

        const failAction = silent
            ? `${Random.varName()}=null;`
            : `die('Format violation');`;

        const check = `${varContent}=file_get_contents(__FILE__);` +
                     `${varLines}=substr_count(${varContent},chr(10));` +
                     `if(${varLines}>${maxLines}){${failAction}}`;

        return check + code;
    },

    /**
     * Verifica el tiempo de modificación del archivo
     */
    timeCheck(code, silent = false) {
        const varTime = Random.varName();
        const maxAge = 86400 * 365; // 1 año en segundos

        const failAction = silent
            ? `${Random.varName()}=false;`
            : `die();`;

        const check = `${varTime}=filemtime(__FILE__);` +
                     `if(time()-${varTime}>${maxAge}){${failAction}}`;

        return check + code;
    },

    /**
     * Fallo silencioso: corrompe variables importantes
     */
    silentCorrupt(code) {
        const varCheck = Random.varName();
        const fakeHash = Random.fakeHash();

        // En vez de morir, corrompe una variable que se usa después
        const corrupt = `${varCheck}=md5(file_get_contents(__FILE__));` +
                       `if(${varCheck}!=='${fakeHash}'){` +
                       `$GLOBALS=array();` + // Esto romperá todo silenciosamente
                       `}`;

        return corrupt + code;
    },

    /**
     * Aplica múltiples checks anti-tamper
     */
    apply(code, options = {}) {
        const {
            md5 = true,
            sha1 = false,
            size = false,
            signature = true,
            format = false,
            silent = true
        } = options;

        let result = code;

        if (md5) result = this.md5Check(result, silent);
        if (sha1) result = this.sha1Check(result, silent);
        if (size) result = this.sizeCheck(result, silent);
        if (signature) result = this.signatureCheck(result, silent);
        if (format) result = this.formatCheck(result, silent);

        return result;
    }
};

export default AntiTamper;
