/**
 * Generador de nombres y valores random
 */
const Random = {
    /**
     * Genera un nombre de variable ofuscado tipo $_0x4f3a
     */
    varName() {
        const hex = Math.random().toString(16).substring(2, 6);
        return `$_0x${hex}`;
    },

    /**
     * Genera un nombre de función ofuscado
     */
    funcName() {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        const prefix = '_';
        let name = prefix;
        for (let i = 0; i < 8; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    },

    /**
     * Genera un string random para código basura
     */
    junkString(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },

    /**
     * Genera un número random entre min y max
     */
    number(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Elige un elemento random de un array
     */
    pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Genera un hash fake para anti-tamper
     */
    fakeHash() {
        let hash = '';
        const chars = 'abcdef0123456789';
        for (let i = 0; i < 32; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }
};

export default Random;
