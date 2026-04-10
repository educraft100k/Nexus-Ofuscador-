/**
 * Funciones auxiliares compartidas
 */
const Helpers = {
    /**
     * Convierte un caracter a su código chr() de PHP
     */
    charToChr(char) {
        return `chr(${char.charCodeAt(0)})`;
    },

    /**
     * Convierte un string a concatenación de chr()
     */
    stringToChr(str) {
        return str.split('').map(c => this.charToChr(c)).join('.');
    },

    /**
     * Convierte un string a hex encoding
     */
    stringToHex(str) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += '\\x' + str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return `"${hex}"`;
    },

    /**
     * Convierte a octal
     */
    stringToOctal(str) {
        let octal = '';
        for (let i = 0; i < str.length; i++) {
            octal += '\\' + str.charCodeAt(i).toString(8);
        }
        return `"${octal}"`;
    },

    /**
     * Encode a base64
     */
    toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    },

    /**
     * ROT13
     */
    rot13(str) {
        return str.replace(/[a-zA-Z]/g, (c) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
        });
    },

    /**
     * Extrae el código PHP sin las tags <?php ?>
     */
    extractPhpCode(code) {
        return code
            .replace(/<\?php/gi, '')
            .replace(/<\?/g, '')
            .replace(/\?>/g, '')
            .trim();
    },

    /**
     * Envuelve código en tags PHP
     */
    wrapPhp(code) {
        return `<?php\n${code}\n?>`;
    },

    /**
     * Cuenta líneas de código
     */
    countLines(code) {
        return code.split('\n').length;
    },

    /**
     * Calcula tamaño aproximado en KB
     */
    sizeInKB(code) {
        return (new Blob([code]).size / 1024).toFixed(2);
    }
};

export default Helpers;
