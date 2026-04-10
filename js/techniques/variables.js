/**
 * Técnicas de ofuscación de variables
 */
import Random from '../utils/random.js';

const Variables = {
    /**
     * Encuentra todas las variables en el código PHP
     */
    findVariables(code) {
        const regex = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const variables = new Set();
        let match;

        // Variables reservadas que no debemos tocar
        const reserved = [
            'this', 'GLOBALS', '_SERVER', '_GET', '_POST',
            '_FILES', '_COOKIE', '_SESSION', '_REQUEST', '_ENV'
        ];

        while ((match = regex.exec(code)) !== null) {
            if (!reserved.includes(match[1])) {
                variables.add(match[1]);
            }
        }

        return Array.from(variables);
    },

    /**
     * Genera un mapa de variables originales a ofuscadas
     */
    generateMap(variables) {
        const map = {};
        const usedNames = new Set();

        for (const variable of variables) {
            let newName;
            do {
                newName = Random.varName();
            } while (usedNames.has(newName));

            usedNames.add(newName);
            map[variable] = newName;
        }

        return map;
    },

    /**
     * Reemplaza todas las variables según el mapa
     */
    replaceVariables(code, map) {
        let result = code;

        // Ordenar por longitud descendente para evitar reemplazos parciales
        const sorted = Object.keys(map).sort((a, b) => b.length - a.length);

        for (const original of sorted) {
            const obfuscated = map[original];
            // Regex que matchea $variable pero no $variableName
            const regex = new RegExp(`\\$${original}(?![a-zA-Z0-9_])`, 'g');
            result = result.replace(regex, obfuscated);
        }

        return result;
    },

    /**
     * Proceso completo: encontrar, mapear y reemplazar
     */
    obfuscate(code) {
        const variables = this.findVariables(code);
        const map = this.generateMap(variables);
        return this.replaceVariables(code, map);
    },

    /**
     * Ofuscación extrema: variables como índices de array GLOBALS
     */
    globalsObfuscate(code) {
        const variables = this.findVariables(code);
        let result = code;
        let declarations = '';

        for (const variable of variables) {
            const key = Random.junkString(6);
            const globalVar = `$GLOBALS['${key}']`;

            // Reemplazar la variable
            const regex = new RegExp(`\\$${variable}(?![a-zA-Z0-9_])`, 'g');
            result = result.replace(regex, globalVar);
        }

        return result;
    }
};

export default Variables;
