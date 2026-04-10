/**
 * Aplicación principal - UI y coordinación
 */
import Obfuscator from './obfuscator.js';

class App {
    constructor() {
        this.inputEditor = document.getElementById('input-code');
        this.outputEditor = document.getElementById('output-code');
        this.levelButtons = document.querySelectorAll('.level-btn');
        this.obfuscateBtn = document.getElementById('obfuscate-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.statsContainer = document.getElementById('stats');

        this.currentLevel = 'medium';

        this.init();
    }

    init() {
        // Event listeners para niveles
        this.levelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.levelButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLevel = e.target.dataset.level;
            });
        });

        // Botón ofuscar
        this.obfuscateBtn.addEventListener('click', () => this.obfuscate());

        // Botón copiar
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Botón limpiar
        this.clearBtn.addEventListener('click', () => this.clear());

        // Permitir Tab en el textarea
        this.inputEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.inputEditor.selectionStart;
                const end = this.inputEditor.selectionEnd;
                this.inputEditor.value = this.inputEditor.value.substring(0, start) +
                    '    ' + this.inputEditor.value.substring(end);
                this.inputEditor.selectionStart = this.inputEditor.selectionEnd = start + 4;
            }
        });
    }

    obfuscate() {
        const code = this.inputEditor.value.trim();

        if (!code) {
            this.showNotification('Primero Pega Tu C�digo <?php', 'error');
            return;
        }

        try {
            // Mostrar loading
            this.obfuscateBtn.disabled = true;
            this.obfuscateBtn.innerHTML = '<span class="spinner"></span> Ofuscando...';

            // Dar tiempo para que se renderice el loading
            setTimeout(() => {
                const result = Obfuscator.obfuscate(code, this.currentLevel);
                this.outputEditor.value = result;

                // Mostrar estadísticas
                const stats = Obfuscator.getStats(code, result);
                this.showStats(stats);

                // Restaurar botón
                this.obfuscateBtn.disabled = false;
                this.obfuscateBtn.innerHTML = ' OBFUSCAR';

                this.showNotification('Codigo ofuscado exitosamente', 'success');
            }, 100);

        } catch (error) {
            console.error(error);
            this.showNotification('Error al ofuscar: ' + error.message, 'error');
            this.obfuscateBtn.disabled = false;
            this.obfuscateBtn.innerHTML = ' OBFUSCAR';
        }
    }

    copyToClipboard() {
        const code = this.outputEditor.value;

        if (!code) {
            this.showNotification('No hay codigo para copiar', 'error');
            return;
        }

        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Copiado al portapapeles', 'success');
            this.copyBtn.innerHTML = 'Copiado';
            setTimeout(() => {
                this.copyBtn.innerHTML = 'Copiar';
            }, 2000);
        }).catch(() => {
            // Fallback para navegadores sin clipboard API
            this.outputEditor.select();
            document.execCommand('copy');
            this.showNotification('Copiado al portapapeles', 'success');
        });
    }

    clear() {
        this.inputEditor.value = '';
        this.outputEditor.value = '';
        this.statsContainer.innerHTML = '';
    }

    showStats(stats) {
        this.statsContainer.innerHTML = `
            <div class="stat">
                <span class="stat-label">Original:</span>
                <span class="stat-value">${stats.originalSize} KB (${stats.originalLines} líneas)</span>
            </div>
            <div class="stat">
                <span class="stat-label">Ofuscado:</span>
                <span class="stat-value">${stats.obfuscatedSize} KB (${stats.obfuscatedLines} líneas)</span>
            </div>
            <div class="stat">
                <span class="stat-label">Ratio:</span>
                <span class="stat-value">${stats.ratio}x</span>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        // Remover notificación anterior
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
