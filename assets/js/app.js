import { AppController } from './controllers/app-controller.js';
import { registerServiceWorker } from './services/service-worker-client.js';

AppController.init();
registerServiceWorker();
