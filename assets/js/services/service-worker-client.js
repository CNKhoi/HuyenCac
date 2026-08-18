export function registerServiceWorker(){
  const isWeb = location.protocol === 'http:' || location.protocol === 'https:';
  if(!isWeb) return;

  // Attach the PWA manifest only on web origins. file:// mode stays completely local.
  if(!document.querySelector('link[rel="manifest"]')){
    const link=document.createElement('link');
    link.rel='manifest';
    link.href='./manifest.webmanifest';
    document.head.appendChild(link);
  }

  if(!('serviceWorker' in navigator) || !window.isSecureContext) return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js').catch(err=>{
      console.warn('[Huyen Cac] Service Worker registration skipped:',err.message);
    });
  },{once:true});
}
