import {getStyle} from './utils.js';

class ContentController {
    constructor(elementFactory, dataService, videoWrapper, pubSub) {
        this.elementFactory = elementFactory;
        this.dataService = dataService;
        this.videoWrapper = videoWrapper;
        this.pubSub = pubSub;
        this.videoWrapperContent = [];
        this.currentPageClass = 'search';
        this.pageMargin = 0;
        this.inputSearchHandler = this.inputSearchHandler.bind(this);
        this.inputKeypressHandler = this.inputKeypressHandler.bind(this);
        this.searchHistoryClickHandler = this.searchHistoryClickHandler.bind(this);
        this.searchNowClickHandler = this.searchNowClickHandler.bind(this);
        this.bookmarksClickHandler = this.bookmarksClickHandler.bind(this);
        this.addToBookmarkHandler = this.addToBookmarkHandler.bind(this);
        this.searchFormHistoryHandler = this.searchFormHistoryHandler.bind(this);
        this.openYouTubeVideo = this.openYouTubeVideo.bind(this);
        this.saveLinksToDOMElement();
        this.bindEvents();
    }

    bindEvents() {
        document.querySelector('main input').addEventListener(
            'keypress', this.inputKeypressHandler
        );
        document.querySelector('.history').addEventListener(
            'click', this.searchHistoryClickHandler
        );
        document.querySelector('.bookmarks').addEventListener(
            'click', this.bookmarksClickHandler
        );
        this.inputWrapperSpanElement.addEventListener(
            'click', this.inputSearchHandler
        );
        this.searchElement.addEventListener('click', this.searchNowClickHandler);
        this.videoWrapper.addEventListener('click', this.addToBookmarkHandler);
        this.videoWrapper.addEventListener('click', this.searchFormHistoryHandler);
        this.videoWrapper.addEventListener('click', this.openYouTubeVideo);
        this.pubSub.on('Swipe:swipeRight', (currentPage, totalPage) => {
            if (totalPage - currentPage <= 2) {
                this.dataService.getItems(this.searchValue, this.nextPageToken)
                    .then((data) => {
                        const fragment = this.elementFactory.createArticles(
                            data.items, JSON.parse(localStorage.getItem('youTubeBookmarks')) || []
                        );
                        this.videoWrapper.appendChild(fragment);
                        this.pubSub.trigger('ContentController:newArticles');
                        this.nextPageToken = data.nextPageToken;
                    });
            }
        });
    }

    saveLinksToDOMElement() {
        this.searchElement = document.querySelector('.search');
        this.inputWrapperSpanElement = document.querySelector('.input-wrapper span');
        this.pageFooterElement = document.querySelector('.page-footer');
        this.inputElement = document.querySelector('input');
    }

    inputKeypressHandler(e) {
        if (e.keyCode !== 13) {
            return;
        }
        const clickEvent = new Event('click');
        this.inputWrapperSpanElement.dispatchEvent(clickEvent);
        this.searchElement.dispatchEvent(clickEvent);
    }

    clearContent(saveVideoWrapperContent, className, e) {
        if (e.target.classList.contains(`${className}`) &&
            e.target.classList.contains('active-header-nav')
        ) {
            return false;
        }
        if (saveVideoWrapperContent) {
            if (this.currentPageClass === 'search') {
                this.pageMargin = parseInt(getStyle(this.videoWrapper).marginLeft);
            }
            this.videoWrapper.style.marginLeft = '0px';
            if (!this.videoWrapperContent.length) {
                while (this.videoWrapper.firstChild) {
                    this.videoWrapperContent.push(
                        this.videoWrapper.removeChild(this.videoWrapper.firstChild)
                    );
                }
            } else {
                while (this.videoWrapper.firstChild) {
                    this.videoWrapper.removeChild(this.videoWrapper.firstChild);
                }
            }
        } else {
            this.videoWrapper.style.marginLeft = `${this.pageMargin}px`;
            while (this.videoWrapper.firstChild) {
                this.videoWrapper.removeChild(this.videoWrapper.firstChild);
            }
            for (let i = 0; i < this.videoWrapperContent.length; i++) {
                this.videoWrapper.appendChild(this.videoWrapperContent[i]);
            }
            this.videoWrapperContent = [];
        }
        document.querySelector('.active-header-nav').classList.remove('active-header-nav');
        document.querySelector(`.${className}`).classList.add('active-header-nav');
        this.currentPageClass = className;
        this.pageFooterElement.classList.add('hidden');
        return true;
    }

    searchHistoryClickHandler(e) {
        if (!this.clearContent(true, 'history', e)) {
            return;
        } else {
            const tmp = this.elementFactory.createSearchHistoryList();
            this.videoWrapper.appendChild(tmp);
            this.pubSub.trigger('ContentController:searchHistory');
        }
    }

    searchNowClickHandler(e) {
        if (!this.clearContent(false, 'search', e)) {
            return;
        } else {
            this.pubSub.trigger('ContentController:searchNow');
        }
    }

    bookmarksClickHandler(e) {
        if (!this.clearContent(true, 'bookmarks', e)) {
            return;
        } else {
            this.loadBookmarks();
        }
    }

    loadBookmarks() {
        const videoIDs = JSON.parse(localStorage.getItem('youTubeBookmarks'));
        if (videoIDs && videoIDs.length) {
            this.dataService.getVideoInfoById(videoIDs, ['snippet', 'statistics'])
                .then((data) => {
                    const tmp = this.elementFactory.createBookmarksList(data.items, videoIDs);
                    this.videoWrapper.appendChild(tmp);
                    this.pubSub.trigger('ContentController:searchNow');
                });
        } else {
            const tmp = this.elementFactory.createBookmarksList([]);
            this.videoWrapper.appendChild(tmp);
            this.pubSub.trigger('ContentController:searchHistory');
        }
    }

    inputSearchHandler(e) {
        const clickEvent = new Event('click');
        this.searchElement.dispatchEvent(clickEvent);
        this.pubSub.trigger('ContentController:searchNow');
        const val = e.target.nextElementSibling.value;
        if (val === '' || this.searchValue === val) {
            return;
        }
        this.videoWrapper.style.marginLeft = '0px';
        while (this.videoWrapper.firstChild) {
            this.videoWrapper.removeChild(this.videoWrapper.firstChild);
        }
        this.dataService.getItems(val)
            .then((data) => {
                if (!data.items.length) {
                    this.pubSub.trigger('ContentController:searchHistory');
                    this.videoWrapper.appendChild(
                        this.elementFactory.createNoSearchResultMessage()
                    );
                }
                const fragment = this.elementFactory.createArticles(data.items,
                    JSON.parse(localStorage.getItem('youTubeBookmarks')) || []
                );
                this.videoWrapper.appendChild(fragment);
                this.searchValue = val;
                this.pubSub.trigger('ContentController:newArticles');
                this.nextPageToken = data.nextPageToken;
            });
        const youTubeSearchHistory = JSON.parse(localStorage.getItem('youTubeSearchHistory'));
        if (youTubeSearchHistory) {
            for (let i = 0; i < youTubeSearchHistory.length; i++) {
                if (youTubeSearchHistory[i][0] === val) {
                    youTubeSearchHistory.splice(i, 1);
                }
            }
            youTubeSearchHistory.push([val, (new Date()).toString().substr(0, 25)]);
            if (youTubeSearchHistory.length > 13) {
                youTubeSearchHistory.splice(0, 1);
            }
            localStorage.setItem('youTubeSearchHistory', JSON.stringify(youTubeSearchHistory));
            return;
        }
        const tmp = [[val, (new Date()).toString().substr(0, 24)]];
        localStorage.setItem('youTubeSearchHistory', JSON.stringify(tmp));
    }

    deleteBookmarkFromVideoWrapperContent(id) {
        for (let i = 0; i < this.videoWrapperContent.length; i++) {
            if (this.videoWrapperContent[i].id === id) {
                this.videoWrapperContent[i].classList.remove('active-bookmark');
            }
        }
    }

    addToBookmarkHandler(e) {
        if (!e.target.classList.contains('fa-bookmark-o')) {
            return;
        }
        const id = e.target.parentNode.parentNode.id;
        e.target.parentNode.parentNode.classList.toggle('active-bookmark');
        const youTubeBookmarks = JSON.parse(localStorage.getItem('youTubeBookmarks'));
        if (youTubeBookmarks) {
            for (let i = 0; i < youTubeBookmarks.length; i++) {
                if (youTubeBookmarks[i] === id) {
                    this.deleteBookmarkFromVideoWrapperContent(
                        youTubeBookmarks.splice(i, 1).toString()
                    );
                    localStorage.setItem('youTubeBookmarks', JSON.stringify(youTubeBookmarks));
                    return;
                }
            }
            youTubeBookmarks.push(id);
            localStorage.setItem('youTubeBookmarks', JSON.stringify(youTubeBookmarks));
            return;
        }
        const tmp = [e.target.parentNode.parentNode.id];
        localStorage.setItem('youTubeBookmarks', JSON.stringify(tmp));
    }

    searchFormHistoryHandler(e) {
        if (
            !e.target.classList.contains('search-text') &&
            !e.target.classList.contains('search-date')
        ) {
            return;
        }
        if (e.target.classList.contains('search-text')) {
            this.inputElement.value = e.target.innerHTML;
        }
        if (e.target.classList.contains('search-date')) {
            this.inputElement.value = e.target.previousElementSibling.innerHTML;
        }
        const click = new Event('click');
        this.searchElement.dispatchEvent(click);
        this.inputWrapperSpanElement.dispatchEvent(click);
    }

    openYouTubeVideo(e) {
        if (!e.target.classList.contains('video-title')) {
            return;
        }
        const id = e.target.parentNode.parentNode.id;
        window.open(`https://www.youtube.com/watch?v=${id}`);
    }
}

export default ContentController;