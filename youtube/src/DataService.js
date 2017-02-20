class DataService {
    getVideoInfoByQuery(val, nextPage) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            if (nextPage) {
                xhr.open(
                    'GET',
                    'https://www.googleapis.com/youtube/v3/search?' +
                    'key=AIzaSyBhRZ03_asTiwIY2DYwUWP8JvcAGkjHNqU&' +
                    'type=video&' +
                    'part=snippet&' +
                    'maxResults=15&' +
                    `pageToken=${nextPage}&` +
                    `q=${val}?`,
                    true
                );
            } else {
                xhr.open(
                    'GET',
                    'https://www.googleapis.com/youtube/v3/search?' +
                    'key=AIzaSyBhRZ03_asTiwIY2DYwUWP8JvcAGkjHNqU&' +
                    'type=video&' +
                    'part=snippet&' +
                    'maxResults=15&' +
                    `q=${val}?`,
                    true
                );
            }
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                resolve(JSON.parse(xhr.responseText));
            };
        });
    }

    getVideoInfoById(idMovies, part) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
                'GET',
                'https://www.googleapis.com/youtube/v3/videos?' +
                'key=AIzaSyBhRZ03_asTiwIY2DYwUWP8JvcAGkjHNqU&' +
                `part=${part}&` +
                `id=${idMovies}`,
                true
            );
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                resolve(JSON.parse(xhr.responseText));
            };
        });
    }

    getItems(val, nextPage) {
        return this.getVideoInfoByQuery(val, nextPage)
            .then((data) => {
                const items = data.items;
                const ids = items.map(item => item.id.videoId);
                const nextPageToken = data.nextPageToken;
                return this.getVideoInfoById(ids, ['snippet', 'statistics'])
                    .then((idData) => {
                        const idItems = idData.items;
                        for (var i = 0; i < items.length; i++) {
                            items[i].statistics = idItems[i].statistics;
                            items[i].snippet = idItems[i].snippet;
                        }
                        return {
                            items,
                            nextPageToken,
                        };
                    });
            });
    }
}

export default DataService;