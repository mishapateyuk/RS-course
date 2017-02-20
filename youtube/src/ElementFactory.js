import {createElem} from './utils.js';

class ElementFactory {

    createWrapper() {
        const wrapper = createElem('div', null, 'wrapper');
        wrapper.appendChild(this.createHeader());
        wrapper.appendChild(this.createMain());
        wrapper.appendChild(this.createFooter());
        return wrapper;
    }

    createHeader() {
        const header = createElem('header', null, 'page-header');
        const nav = createElem('nav', null, 'header-nav');
        const ul = document.createElement('ul');
        const liSearch = document.createElement('li');
        const liBookmarks = document.createElement('li');
        const liHistory = document.createElement('li');
        liSearch.appendChild(createElem('span', 'Search now', 'active-header-nav', 'search'));
        liBookmarks.appendChild(createElem('span', 'Bookmarks', 'bookmarks'));
        liHistory.appendChild(createElem('span', 'Search history', 'history'));
        nav.appendChild(ul);
        ul.appendChild(liSearch);
        ul.appendChild(liBookmarks);
        ul.appendChild(liHistory);
        header.appendChild(nav);
        return header;
    }

    createFooter() {
        const footer = createElem('footer', null, 'page-footer', 'hidden');
        const nav = createElem('nav', null, 'footer-nav');
        const ul = document.createElement('ul');
        ul.appendChild(createElem('li', 1, 'active-page'));
        ul.appendChild(createElem('li'));
        ul.appendChild(createElem('li'));
        ul.appendChild(createElem('li'));
        nav.appendChild(ul);
        footer.appendChild(nav);
        return footer;
    }

    createMain() {
        const main = document.createElement('main');
        const inputWrapper = createElem('div', null, 'input-wrapper');
        const videoWrapper = createElem('div', null, 'video-wrapper');
        const span = document.createElement('span');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Search for YouTube videos');
        inputWrapper.appendChild(span);
        inputWrapper.appendChild(input);
        main.appendChild(inputWrapper);
        main.appendChild(videoWrapper);
        return main;
    }

    createVideoInfo(data, IDs) {
        const article = createElem('article', null, 'video-info');
        const id = typeof data.id === 'string' ? data.id : data.id.videoId;
        if (~IDs.indexOf(id)) {
            article.classList.add('active-bookmark');
        }
        article.setAttribute('id', id);
        const img = document.createElement('img');
        const divDefinition = createElem('div', null, 'defenition');
        const videoTitle = createElem('h2', data.snippet.title, 'video-title');
        const authorBox = createElem('p', null, 'author-box');
        const author = createElem('span', data.snippet.channelTitle, 'author');
        const videoDate = createElem('span', data.snippet.publishedAt.slice(0, 10), 'date');
        const videoDescription = createElem('p', data.snippet.description, 'description');
        const divViews = createElem('div', data.statistics.viewCount, 'views');
        const divLikes = createElem('div', data.statistics.likeCount, 'likes');
        const divBookmark = createElem('div', null, 'bookmark');
        const viewsIcon = createElem('i', null, 'fa', 'fa-eye');
        const likesIcon = createElem('i', null, 'fa', 'fa-thumbs-o-up');
        const bookmarkIcon = createElem('i', null, 'fa', 'fa-bookmark-o');

        article.appendChild(img);
        article.appendChild(divDefinition);
        article.appendChild(divViews);
        article.appendChild(divLikes);
        article.appendChild(divBookmark);
        authorBox.appendChild(author);
        authorBox.appendChild(videoDate);
        divDefinition.appendChild(videoTitle);
        divDefinition.appendChild(authorBox);
        divDefinition.appendChild(videoDescription);
        divBookmark.appendChild(bookmarkIcon);
        divViews.insertBefore(viewsIcon, divViews.firstChild);
        divLikes.insertBefore(likesIcon, divLikes.firstChild);

        img.setAttribute('src', data.snippet.thumbnails.medium.url);
        img.setAttribute('alt', data.snippet.title);
        videoTitle.setAttribute('title', data.snippet.title);
        authorBox.setAttribute('title', data.snippet.channelTitle);
        return article;
    }

    createArticles(articles, IDs) {
        const fragment = document.createDocumentFragment();
        for (var i = 0; i < articles.length; i++) {
            fragment.appendChild(this.createVideoInfo(articles[i], IDs));
        }
        return fragment;
    }

    createSearchHistoryList() {
        function createSearchListItem(text, data) {
            const li = document.createElement('li');
            const searchText = createElem('span', text, 'search-text');
            const searchData = createElem('span', data, 'search-date');
            li.appendChild(searchText);
            li.appendChild(searchData);
            return li;
        }
        const ul = createElem('ul', null, 'search-list');
        if (!localStorage.getItem('youTubeSearchHistory')) {
            ul.appendChild(createSearchListItem(
                'There is no search history yet ; -)'
            ));
            return ul;
        }
        const history = JSON.parse(localStorage.getItem('youTubeSearchHistory'));
        history.reverse();
        for (let i = 0; i < history.length; i++) {
            ul.appendChild(createSearchListItem(history[i][0], history[i][1]));
        }
        return ul;
    }

    createBookmarksList (articles, IDs) {
        if (!articles.length) {
            const ul = createElem('ul', null, 'search-list');
            ul.appendChild(createElem(
                'li',
                'There is no bookmarks yet ; -)'
            ));
            return ul;
        } else {
            return this.createArticles(articles, IDs);
        }
    }

    createNoSearchResultMessage () {
        const ul = createElem('ul', null, 'search-list');
        ul.appendChild(createElem(
            'li',
            'There is no search result ; -)'
        ));
        return ul;
    }
}

export default ElementFactory;