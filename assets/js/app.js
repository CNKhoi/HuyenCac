import { AppController } from './controllers/app-controller.js';
import { registerServiceWorker } from './services/service-worker-client.js';
import { InteractionManager } from './services/interaction-manager.js';

InteractionManager.init();
AppController.init();
registerServiceWorker();
