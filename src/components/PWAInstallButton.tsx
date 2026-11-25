import React, { useState } from 'react';
import { Download, Share, PlusSquare, MonitorSmartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled && !justInstalled) {
    return null;
  }

  if (justInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">App instalada</span>
      </span>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setJustInstalled(true);
      }
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
        title="Instalar como aplicación en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar app</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="pwa-install-guide-title"
                    className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white"
                  >
                    {isIOS ? 'Instalar en iPhone / iPad' : 'Instalar como app del navegador'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Acceso directo en pantalla y uso sin conexión (PWA)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Cerrar instrucciones de instalación"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">1.</span>
                  <span>
                    Abre la app directamente en <strong>Safari</strong> (fuera de una vista incrustada).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">2.</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Pulsa el botón <Share className="w-4 h-4 inline text-sky-500" />{' '}
                    <strong>Compartir</strong> en la barra inferior.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">3.</span>
                  <span className="inline-flex flex-wrap items-center gap-1">
                    Desliza hacia abajo y elige <PlusSquare className="w-4 h-4 inline text-amber-500" />{' '}
                    <strong>Añadir a pantalla de inicio</strong>.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">1.</span>
                  <span>
                    Abre la URL de la aplicación en una <strong>pestaña independiente</strong> de Chrome, Edge o Brave (los navegadores bloquean el diálogo automático dentro de iframes).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">2.</span>
                  <span>
                    Pulsa de nuevo este botón <strong>«Instalar app»</strong> o el icono de instalación en la barra de direcciones (o menú <strong>⋮ → Instalar aplicación</strong>).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-500">3.</span>
                  <span>
                    Una vez instalada, se abrirá en su propia ventana independiente y funcionará incluso <strong>sin conexión a internet</strong>.
                  </span>
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
