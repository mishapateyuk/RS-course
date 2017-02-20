import {getStyle} from './utils.js';

class Swipe {
    constructor(slideWidth, videoWrapper, pubSub) {
        this.pubSub = pubSub;
        this.videoWrapper = videoWrapper;
        this.slideWidth = slideWidth;
        this.currentPageNumber = 0;
        this.mouseDownPosition = null;
        this.mouseDownMargin = null;
        this.moveSlideHandler = this.moveSlideHandler.bind(this);
        this.mousedownHandler = this.mousedownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.pageClickHandler = this.pageClickHandler.bind(this);
        this.pagging = this.pagging.bind(this);
        this.saveLinksToDOMElement();
        this.bindEvents();
    }

    saveLinksToDOMElement() {
        this.footerNavUl = document.querySelector('.footer-nav ul');
        this.pageFooter = document.querySelector('.page-footer');
    }

    bindEvents() {
        this.pubSub.on('ScreenWatcher:changeWidth', (width) => {
            this.slideWidth = width;
            this.pagging();
        });
        this.pubSub.on('ContentController:searchHistory', () => {
            this.videoWrapper.removeEventListener('transitionend', this.pagging);
            this.footerNavUl.removeEventListener('click', this.pageClickHandler);
            document.body.removeEventListener('mousedown', this.mousedownHandler);
            document.body.removeEventListener('mouseup', this.mouseUpHandler);
            document.body.removeEventListener('touchstart', this.mousedownHandler);
            document.body.removeEventListener('touchend', this.mouseUpHandler);
        });
        this.pubSub.on('ContentController:searchNow', () => {
            this.videoWrapper.addEventListener('transitionend', this.pagging);
            this.footerNavUl.addEventListener('click', this.pageClickHandler);
            document.body.addEventListener('mousedown', this.mousedownHandler);
            document.body.addEventListener('mouseup', this.mouseUpHandler);
            document.body.addEventListener('touchstart', this.mousedownHandler);
            document.body.addEventListener('touchend', this.mouseUpHandler);
            this.pagging();
        });
        this.pubSub.on('ContentController:newArticles', () => {
            this.pagging();
        });
    }

    calculatePagesCount() {
        this.pagesCount = Math.ceil(this.videoWrapper.children.length * 365 / this.slideWidth - 1);
    }

    mousedownHandler(e) {
        if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'LI') {
            return;
        }
        if (e.clientX) {
            this.mouseDownPosition = e.clientX;
            document.body.addEventListener('mousemove', this.moveSlideHandler);
        } else {
            this.mouseDownPosition = e.targetTouches[0].clientX;
            document.body.addEventListener('touchmove', this.moveSlideHandler);
        }
        this.mouseDownMargin = parseInt(getStyle(this.videoWrapper).marginLeft);
    }

    moveSlideHandler(e) {
        this.videoWrapper.style.transition = 'none';
        const mouseMovePosition = e.clientX || e.targetTouches[0].clientX;
        let positionDifference = mouseMovePosition - this.mouseDownPosition;
        const margin = this.mouseDownMargin + positionDifference;
        this.videoWrapper.style.marginLeft = `${margin}px`;
    }

    mouseUpHandler(e) {
        if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'LI') {
            return;
        }
        this.calculatePagesCount();
        this.videoWrapper.style.transition = '0.5s';
        const currentMargin = parseInt(getStyle(this.videoWrapper).marginLeft);
        this.slideNumber = Math.floor(currentMargin / this.slideWidth);
        const marginLimit = -(this.slideWidth * this.pagesCount);
        this.controlLimit(currentMargin, marginLimit);
        this.turnPage(currentMargin, marginLimit);
        document.body.removeEventListener('mousemove', this.moveSlideHandler);
        document.body.removeEventListener('touchmove', this.moveSlideHandler);
    }

    pageClickHandler(e) {
        if (e.target.nodeName !== 'LI') {
            return;
        }
        this.videoWrapper.style.transition = '0.5s';
        if (document.querySelector('.active-header-nav').classList.contains('search')) {
            this.pubSub.trigger('Swipe:swipeRight', e.target.innerHTML - 1, this.pagesCount);
        }
        const pageNumber = -(e.target.innerHTML - 1);
        this.videoWrapper.style.marginLeft = `${pageNumber * this.slideWidth}px`;
    }

    controlLimit(currentMargin, marginLimit) {
        this.calculatePagesCount();
        if (currentMargin >= 0) {
            this.videoWrapper.style.marginLeft = '0px';
        } else if (currentMargin < marginLimit) {
            this.videoWrapper.style.marginLeft = `${marginLimit}px`;
        }
    }

    turnPage(currentMargin, marginLimit) {
        if (currentMargin < this.mouseDownMargin && currentMargin > marginLimit) {
            const nextPageMargin = this.slideNumber * this.slideWidth;
            this.videoWrapper.style.marginLeft = `${nextPageMargin}px`;
            if (document.querySelector('.active-header-nav').classList.contains('search')) {
                this.pubSub.trigger('Swipe:swipeRight', -this.slideNumber, this.pagesCount);
            }
        }
        if (currentMargin > this.mouseDownMargin && currentMargin < 0) {
            const prevPageMargin = (this.slideNumber + 1) * this.slideWidth;
            this.videoWrapper.style.marginLeft = `${prevPageMargin}px`;
        }
        if (Math.abs(this.mouseDownMargin - currentMargin) < 20) { // for incorrect click or mobile scrolling
            this.videoWrapper.style.marginLeft = `${this.mouseDownMargin}px`;
        }
    }

    pagging() {
        if (
            this.videoWrapper.childElementCount &&
            this.videoWrapper.firstChild.classList.contains('video-info')
        ) {
            this.footerNavUl.parentNode.parentNode.classList.remove('hidden');
            this.calculatePagesCount();
        } else {
            return;
        }
        const currentMargin = parseInt(getStyle(this.videoWrapper).marginLeft);
        this.currentPageNumber = Math.round(Math.abs(currentMargin / this.slideWidth));
        const pageNumberListItems = this.footerNavUl.children;
        this.footerNavUl.querySelector('.active-page').classList.remove('active-page');
        if (this.footerNavUl.querySelector('.no-border')) {
            this.footerNavUl.querySelector('.no-border').classList.remove('no-border');
        }
        if (this.currentPageNumber < 3) {
            pageNumberListItems[0].classList.remove('add-pseudo');
            pageNumberListItems[this.currentPageNumber].classList.add('active-page');
            if (pageNumberListItems[this.pagesCount]) {
                pageNumberListItems[this.pagesCount].classList.add('no-border');
            }
            for (let i = 1; i < 4; i++) {
                if (i > this.pagesCount) {
                    pageNumberListItems[i].innerHTML = '';
                } else {
                    pageNumberListItems[i].innerHTML = i + 1;
                }
            }
        } else {
            pageNumberListItems[0].classList.add('add-pseudo');
            for (let i = 1; i < 4; i++) {
                if (this.pagesCount === this.currentPageNumber) {
                    pageNumberListItems[i].innerHTML = this.currentPageNumber - 2 + i;
                    pageNumberListItems[3].classList.add('active-page');
                } else {
                    pageNumberListItems[i].innerHTML = this.currentPageNumber - 1 + i;
                    pageNumberListItems[2].classList.add('active-page');
                }
            }
        }
    }
}

export default Swipe;