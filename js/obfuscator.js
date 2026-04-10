/**
 * Motor principal de ofuscación
 * Coordina todas las técnicas según el nivel seleccionado
 */
import Encoding from './techniques/encoding.js';
import Variables from './techniques/variables.js';
import Strings from './techniques/strings.js';
import ControlFlow from './techniques/controlflow.js';
import Junk from './techniques/junk.js';
import AntiTamper from './techniques/antitamper.js';
import Helpers from './utils/helpers.js';

const Obfuscator = {
    /**
     * Configuración por nivel
     */
    levels: {
        light: {
            encoding: 1,
            variables: true,
            strings: false,
            controlFlow: false,
            junk: 0,
            antiTamper: false
        },
        medium: {
            encoding: 2,
            variables: true,
            strings: true,
            controlFlow: 'light',
            junk: 2,
            antiTamper: false
        },
        heavy: {
            encoding: 3,
            variables: true,
            strings: true,
            controlFlow: 'medium',
            junk: 4,
            antiTamper: true
        },
        insane: {
            encoding: 5,
            variables: true,
            strings: true,
            controlFlow: 'insane',
            junk: 6,
            antiTamper: true,
            silent: true
        }
    },

    /**
     * Ofusca código PHP con el nivel especificado
     */
    obfuscate(code, level = 'medium', customOptions = {}) {
        const config = { ...this.levels[level], ...customOptions };
        let result = code;

        // Extraer código PHP sin tags
        result = Helpers.extractPhpCode(result);

        // 1. Ofuscar variables
        if (config.variables) {
            result = Variables.obfuscate(result);
        }

        // 2. Ofuscar strings
        if (config.strings) {
            result = Strings.obfuscate(result, 'random');
        }

        // 3. Inyectar código basura
        if (config.junk > 0) {
            result = Junk.inject(result, config.junk);
        }

        // 4. Ofuscar control flow
        if (config.controlFlow) {
            result = ControlFlow.obfuscate(result, config.controlFlow);
        }

        // 5. Anti-tampering
        if (config.antiTamper) {
            result = AntiTamper.apply(result, {
                md5: true,
                signature: true,
                silent: config.silent || false
            });
        }

        // 6. Capas de encoding (al final para envolver todo)
        if (config.encoding > 0) {
            result = Encoding.multiLayer(result, config.encoding);
        }

        // Minificar (quitar espacios y saltos de línea innecesarios)
        result = this.minify(result);

        // Envolver en tags PHP
        result = this.addHeader(result);

        return result;
    },

    /**
     * Minifica el código PHP
     */
    minify(code) {
        return code
            .replace(/\s+/g, ' ')           // Múltiples espacios a uno
            .replace(/\s*([{};,()])\s*/g, '$1') // Quitar espacios alrededor de símbolos
            .replace(/;\s*}/g, ';}')        // Punto y coma antes de }
            .trim();
    },

    /**
     * Añade header de protección
     */
    addHeader(code) {
        const header = `<?php\n/* Protected by PHP Obfuscator | ${new Date().toISOString().split('T')[0]} */\n/* DO NOT EDIT - This file has been encrypted */\n`;
        return header + code;
    },

    /**
     * Obtiene estadísticas de la ofuscación
     */
    getStats(originalCode, obfuscatedCode) {
        return {
            originalSize: Helpers.sizeInKB(originalCode),
            obfuscatedSize: Helpers.sizeInKB(obfuscatedCode),
            originalLines: Helpers.countLines(originalCode),
            obfuscatedLines: Helpers.countLines(obfuscatedCode),
            ratio: (new Blob([obfuscatedCode]).size / new Blob([originalCode]).size).toFixed(2)
        };
    }
};

export default Obfuscator;
