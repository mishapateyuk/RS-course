class ScreenWatcher {
    constructor(pubSub) {
        this.pubSub = pubSub;
        this.resizeHandler = this.resizeHandler.bind(this);
        window.addEventListener('resize', this.resizeHandler);
    }

    resizeHandler() {
        const screenWidth = this.getScreenWidth();
        this.pubSub.trigger('ScreenWatcher:changeWidth', screenWidth);
    }

    getScreenWidth() {
        const screenWidth = window.outerWidth;
        if(screenWidth > 1460) {
            return 1460;
        } else if (screenWidth > 1095) {
            return 1095;
        } else if (screenWidth > 730) {
            return 730;
        }
        return 365;
    }
}

export default ScreenWatcher;