import Swipe from './Swipe.js';
import PubSub from './PubSub.js';
import ElementFactory from './ElementFactory.js';
import ScreenWatcher from './ScreenWatcher.js';
import ContentController from './ContentController.js';
import DataService from './DataService.js';
import {createElem} from './utils.js';

class App {
    constructor() {
        this.pubSub = new PubSub();
        this.screenWatcher = new ScreenWatcher(this.pubSub);
        this.elementFactory = new ElementFactory();
        this.dataService = new DataService();
    }

    start() {
        const wrapper = this.elementFactory.createWrapper();
        const videoWrapper = wrapper.querySelector('.video-wrapper');
        document.body.appendChild(wrapper);
        this.contentController = new ContentController(
            this.elementFactory,
            this.dataService,
            videoWrapper,
            this.pubSub
        );
        this.swipe = new Swipe(this.screenWatcher.getScreenWidth(), videoWrapper, this.pubSub);
    }
}

window.app = new App();

window.app.start();