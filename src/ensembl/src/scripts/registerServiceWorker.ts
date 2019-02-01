declare global {
  interface Window {
    nodeEnv: string | undefined;
  }
}

export function registerSW() {
  window.nodeEnv = process.env.NODE_ENV;

  if (window.nodeEnv === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.info('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.info('SW registration failed: ', registrationError);
        });
    });
  }
}
