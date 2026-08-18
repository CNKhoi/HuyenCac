export function registerServiceWorker(){
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('[Huyen Cac] Service Worker registration skipped:', err.message);
    });
  });
}
