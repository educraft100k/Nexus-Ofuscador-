/**
 * PHP Obfuscator v5.0 - PMMP COMPATIBLE
 * Inteligente: mantiene estructura, ofusca contenido ☠️
 */

const Random = {
    varName() {
        const prefixes = ['_0x', 'O0', 'l1'];
        const hex = Math.random().toString(16).substring(2, 6);
        return `$${this.pick(prefixes)}${hex}`;
    },

    junkString(len = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let r = '';
        for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * chars.length)];
        return r;
    },

    number(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
};

const Helpers = {
    toBase64(str) {
        try { return btoa(unescape(encodeURIComponent(str))); }
        catch { return btoa(str); }
    },

    rot13(str) {
        return str.replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
        });
    },

    countLines(code) { return code.split('\n').length; },
    sizeInKB(code) { return (new Blob([code]).size / 1024).toFixed(2); }
};

// ============================================
// PARSER INTELIGENTE PARA PMMP
// ============================================
const PHPParser = {
    // Extraer partes del código
    parse(code) {
        const result = {
            header: '',      // namespace, use statements
            classStart: '',  // class declaration
            methods: [],     // array de {signature, body}
            classEnd: '}'
        };

        // Extraer namespace y use statements
        const headerMatch = code.match(/^([\s\S]*?)(?=class\s+\w+)/);
        if (headerMatch) {
            result.header = headerMatch[1].trim();
        }

        // Extraer declaración de clase
        const classMatch = code.match(/class\s+\w+[^{]*\{/);
        if (classMatch) {
            result.classStart = classMatch[0];
        }

        // Extraer métodos con sus cuerpos
        const methodRegex = /((?:public|private|protected)\s+(?:static\s+)?function\s+\w+\s*\([^)]*\)(?:\s*:\s*\??\w+)?)\s*\{/g;
        let match;
        let lastIndex = code.indexOf(result.classStart) + result.classStart.length;

        while ((match = methodRegex.exec(code)) !== null) {
            const signature = match[1];
            const bodyStart = match.index + match[0].length;

            // Encontrar el cierre del método (contar llaves)
            let braceCount = 1;
            let bodyEnd = bodyStart;

            for (let i = bodyStart; i < code.length && braceCount > 0; i++) {
                if (code[i] === '{') braceCount++;
                else if (code[i] === '}') braceCount--;
                if (braceCount === 0) bodyEnd = i;
            }

            const body = code.substring(bodyStart, bodyEnd).trim();

            result.methods.push({
                signature: signature,
                body: body
            });
        }

        return result;
    },

    // Reconstruir el código
    reconstruct(parsed, obfuscatedMethods) {
        // Limpiar <?php del header si existe
        let cleanHeader = parsed.header.replace(/<\?php/gi, '').replace(/<\?/g, '').trim();

        let code = '<?php\n\n';
        code += cleanHeader + '\n\n';
        code += parsed.classStart + '\n\n';

        for (let i = 0; i < parsed.methods.length; i++) {
            const method = parsed.methods[i];
            const obfuscatedBody = obfuscatedMethods[i];

            code += `    ${method.signature} {\n`;
            code += `        ${obfuscatedBody}\n`;
            code += `    }\n\n`;
        }

        code += parsed.classEnd;
        return code;
    }
};

// ============================================
// OFUSCADOR DE CUERPO DE MÉTODO
// ============================================
const MethodObfuscator = {
    // XOR seguro con hex
    xorEncrypt(code, key) {
        let hexData = '';
        for (let i = 0; i < code.length; i++) {
            const xored = code.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            hexData += xored.toString(16).padStart(2, '0');
        }
        return hexData;
    },

    // Generar key alfanumérica segura
    generateKey(len = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < len; i++) key += chars[Math.floor(Math.random() * chars.length)];
        return key;
    },

    // Ofuscar un cuerpo de método
    obfuscate(body, layers = 5) {
        if (!body.trim()) return '// empty';

        let code = body;

        // Aplicar capas de encoding
        for (let i = 0; i < layers; i++) {
            code = this.applyLayer(code);
        }

        return code;
    },

    applyLayer(code) {
        const technique = Random.number(1, 6);

        switch (technique) {
            case 1: // Base64 simple
                return this.wrapBase64(code);

            case 2: // ROT13 + Base64
                return this.wrapRot13Base64(code);

            case 3: // XOR + Hex
                return this.wrapXor(code);

            case 4: // Base64 con variables
                return this.wrapBase64Variables(code);

            case 5: // Anti-tamper con CRC32
                return this.wrapWithIntegrity(code);

            case 6: // XOR con key fragmentada en chr()
                return this.wrapXorFragmented(code);

            default:
                return this.wrapBase64(code);
        }
    },

    wrapBase64(code) {
        const encoded = Helpers.toBase64(code);
        const varD = Random.varName();
        return `${varD}=base64_decode('${encoded}');eval(${varD});`;
    },

    wrapRot13Base64(code) {
        const rotted = Helpers.rot13(code);
        const encoded = Helpers.toBase64(rotted);
        const varD = Random.varName();
        return `${varD}=str_rot13(base64_decode('${encoded}'));eval(${varD});`;
    },

    wrapXor(code) {
        const key = this.generateKey(16);
        const hexData = this.xorEncrypt(code, key);

        const varK = Random.varName();
        const varH = Random.varName();
        const varD = Random.varName();
        const varR = Random.varName();
        const varI = Random.varName();

        return `${varK}='${key}';` +
               `${varH}='${hexData}';` +
               `${varD}=hex2bin(${varH});` +
               `${varR}='';` +
               `for(${varI}=0;${varI}<strlen(${varD});${varI}++){` +
               `${varR}.=chr(ord(${varD}[${varI}])^ord(${varK}[${varI}%16]));` +
               `}eval(${varR});`;
    },

    // XOR con strings fragmentados usando chr() - más difícil de leer
    wrapXorFragmented(code) {
        const key = this.generateKey(16);
        const hexData = this.xorEncrypt(code, key);

        // Fragmentar la key usando chr()
        let keyFragmented = '';
        for (let i = 0; i < key.length; i++) {
            keyFragmented += `chr(${key.charCodeAt(i)}).`;
        }
        keyFragmented = keyFragmented.slice(0, -1); // quitar último punto

        const varK = Random.varName();
        const varH = Random.varName();
        const varD = Random.varName();
        const varR = Random.varName();
        const varI = Random.varName();

        return `${varK}=${keyFragmented};` +
               `${varH}='${hexData}';` +
               `${varD}=hex2bin(${varH});` +
               `${varR}='';` +
               `for(${varI}=0;${varI}<strlen(${varD});${varI}++){` +
               `${varR}.=chr(ord(${varD}[${varI}])^ord(${varK}[${varI}%16]));` +
               `}eval(${varR});`;
    },

    wrapBase64Variables(code) {
        const encoded = Helpers.toBase64(code);
        const varF = Random.varName();
        const varD = Random.varName();

        // eval() es language construct, NO se puede llamar como variable
        return `${varF}='base64_decode';` +
               `${varD}='${encoded}';` +
               `eval(${varF}(${varD}));`;
    },

    // Anti-tamper: verifica integridad antes de ejecutar
    wrapWithIntegrity(code) {
        const encoded = Helpers.toBase64(code);
        // Calcular CRC32 del payload
        const crc = this.crc32(encoded);

        const varP = Random.varName();  // payload
        const varC = Random.varName();  // crc esperado
        const varH = Random.varName();  // hash calculado

        return `${varP}='${encoded}';` +
               `${varC}=${crc};` +
               `${varH}=crc32(${varP});` +
               `if(${varH}!==${varC}){return;}` +
               `eval(base64_decode(${varP}));`;
    },

    // CRC32 en JS (compatible con PHP)
    crc32(str) {
        let crc = 0 ^ (-1);
        for (let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ this.crc32Table[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    },

    crc32Table: (() => {
        let table = [];
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[n] = c >>> 0;
        }
        return table;
    })()
};

// ============================================
// MOTOR PRINCIPAL - PMMP COMPATIBLE
// ============================================
const Obfuscator = {
    // Header épico
    getHeader(id, date) {
        return `/*
 *    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
 *   ⬡                                                       ⬡
 *  ⬡     ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗        ⬡
 *   ⬡    ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝       ⬡
 *  ⬡     ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗        ⬡
 *   ⬡    ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║       ⬡
 *  ⬡     ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║        ⬡
 *   ⬡    ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝       ⬡
 *  ⬡                                                         ⬡
 *    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
 *   ⬡                                                       ⬡
 *  ⬡   ╔═══════════════════════════════════════════════╗     ⬡
 *   ⬡  ║  NEXUS OBFUSCATOR - PHP Protection Tool      ║    ⬡
 *  ⬡   ║  @author NexusTeam                           ║     ⬡
 *   ⬡  ║  @discord zkazen                             ║    ⬡
 *  ⬡   ║  @protected YES                              ║     ⬡
 *   ⬡  ╚═══════════════════════════════════════════════╝    ⬡
 *  ⬡                                                         ⬡
 *   ⬡  [!] Este codigo esta protegido y ofuscado            ⬡
 *  ⬡   [!] Modificarlo causara errores de ejecucion          ⬡
 *   ⬡  [!] Build: ${id} | ${date}                              ⬡
 *  ⬡                                                         ⬡
 *    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
 */`;
    },

    obfuscate(code) {
        // Detectar si es un plugin de PMMP (tiene namespace y class)
        const isPMMP = code.includes('namespace') && code.includes('class') &&
                       (code.includes('PluginBase') || code.includes('Listener') || code.includes('pocketmine'));

        if (isPMMP) {
            return this.obfuscatePMMP(code);
        } else {
            return this.obfuscateSimple(code);
        }
    },

    // Ofuscar plugin PMMP manteniendo estructura
    obfuscatePMMP(code) {
        const parsed = PHPParser.parse(code);

        // Ofuscar cada método
        const layers = Random.number(4, 6);
        const obfuscatedMethods = parsed.methods.map(m => {
            if (m.body.trim()) {
                return MethodObfuscator.obfuscate(m.body, layers);
            }
            return '// empty';
        });

        // Reconstruir
        let result = PHPParser.reconstruct(parsed, obfuscatedMethods);

        // Agregar header épico
        const id = Random.junkString(6).toUpperCase();
        const date = new Date().toISOString().split('T')[0];
        const header = this.getHeader(id, date);
        result = result.replace('<?php', `<?php\n${header}`);

        return result;
    },

    // Ofuscar código simple (no PMMP)
    obfuscateSimple(code) {
        let cleaned = code.replace(/<\?php/gi, '').replace(/<\?/g, '').replace(/\?>/g, '').trim();

        const layers = Random.number(5, 8);
        let result = cleaned;

        for (let i = 0; i < layers; i++) {
            result = MethodObfuscator.applyLayer(result);
        }

        const id = Random.junkString(6).toUpperCase();
        const date = new Date().toISOString().split('T')[0];
        const header = this.getHeader(id, date);

        return `<?php\n${header}\n${result}`;
    },

    getStats(original, obfuscated) {
        return {
            originalSize: Helpers.sizeInKB(original),
            obfuscatedSize: Helpers.sizeInKB(obfuscated),
            originalLines: Helpers.countLines(original),
            obfuscatedLines: Helpers.countLines(obfuscated),
            ratio: (new Blob([obfuscated]).size / new Blob([original]).size).toFixed(2)
        };
    }
};

// ============================================
// APP
// ============================================
class App {
    constructor() {
        this.input = document.getElementById('input-code');
        this.output = document.getElementById('output-code');
        this.btnObfuscate = document.getElementById('obfuscate-btn');
        this.btnCopy = document.getElementById('copy-btn');
        this.btnClear = document.getElementById('clear-btn');
        this.stats = document.getElementById('stats');
        this.init();
    }

    init() {
        this.btnObfuscate.addEventListener('click', () => this.obfuscate());
        this.btnCopy.addEventListener('click', () => this.copy());
        this.btnClear.addEventListener('click', () => this.clear());
    }

    obfuscate() {
        const code = this.input.value.trim();
        if (!code) {
            this.notify('Pega tu codigo PHP', 'error');
            return;
        }

        this.btnObfuscate.disabled = true;
        this.btnObfuscate.innerHTML = '<span class="spinner"></span>';

        setTimeout(() => {
            try {
                const result = Obfuscator.obfuscate(code);
                this.output.value = result;
                this.showStats(Obfuscator.getStats(code, result));
                this.notify('Protegido', 'success');
            } catch (e) {
                console.error(e);
                this.notify('Error: ' + e.message, 'error');
            }
            this.btnObfuscate.disabled = false;
            this.btnObfuscate.innerHTML = '🌱 OFUSCAR';
        }, 150);
    }

    copy() {
        if (!this.output.value) {
            this.notify('No hay codigo', 'error');
            return;
        }
        navigator.clipboard.writeText(this.output.value).then(() => {
            this.notify('Copiado', 'success');
            this.btnCopy.innerHTML = '✓';
            setTimeout(() => this.btnCopy.innerHTML = '📋', 1500);
        });
    }

    clear() {
        this.input.value = '';
        this.output.value = '';
        this.stats.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;">Stats aqui</p>';
    }

    showStats(s) {
        this.stats.innerHTML = `
            <div class="stat-item"><span class="stat-label">Original</span><span class="stat-value">${s.originalSize} KB</span></div>
            <div class="stat-item"><span class="stat-label">Protegido</span><span class="stat-value">${s.obfuscatedSize} KB</span></div>
            <div class="stat-item"><span class="stat-label">Ratio</span><span class="stat-value">${s.ratio}x</span></div>
        `;
    }

    notify(msg, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const n = document.createElement('div');
        n.className = `notification ${type}`;
        n.textContent = msg;
        document.body.appendChild(n);

        setTimeout(() => n.classList.add('show'), 10);
        setTimeout(() => {
            n.classList.remove('show');
            setTimeout(() => n.remove(), 300);
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
