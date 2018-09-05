export function registerSW() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.info('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.info('SW registration failed: ', registrationError);
        });
    });
  }
}
