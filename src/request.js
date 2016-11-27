function meetup_request(meetup_variable){
    this.meetup_variable = meetup_variable;
    this.URL = 'https://scalr.api.appbase.io';
    this.FILTER_URL = 'http://scalr.api.appbase.io/meetup2/meetup/_search';
    this.USERNAME = 'qz4ZD8xq1';
    this.PASSWORD = 'a0edfc7f-5611-46f6-8fe1-d4db234631f3';
    this.APPNAME = 'meetup2';
    this.SINGLE_RECORD_CLONE = $('.single_record_for_clone').clone();
    this.FROM = 0;
    this.PAGE_SIZE = 25;
}

meetup_request.prototype = {
    constructor: meetup_request,
    // create streaming client if one does not already exist
    GET_STREAMING_CLIENT() {
        if (typeof streamingClient === 'undefined') {
            streamingClient = new Appbase({
                url: this.URL,
                appname: this.APPNAME,
                username: this.USERNAME,
                password: this.PASSWORD
            });
        }
        return streamingClient;
    },
    // start streaming data
    STREAM_START(CITY_LIST, TOPIC_LIST) {
        const $this = this;
        const streaming = this.GET_STREAMING_CLIENT();
        var search_payload = this.GET_PAYLOAD(CITY_LIST, TOPIC_LIST);
        delete search_payload.size;
        if (typeof responseStream !== 'undefined') {
            responseStream.stop();
        }
        return responseStream = streaming.searchStream(search_payload);
    },
    // get payload based on cities and topics
    GET_PAYLOAD(CITY_LIST, TOPIC_LIST) {
        const $this = this;
        if (CITY_LIST.length || TOPIC_LIST.length) {
            var search_payload = $this.SEARCH_PAYLOAD('filter');
            if (CITY_LIST.length) {
                search_payload['body']['query']['filtered']['filter']['and'][0] = {
                    'terms': {
                        "group_city_simple": CITY_LIST
                    }
                };
            }
        }

        if (TOPIC_LIST.length) {
            if (CITY_LIST.length) {
                var ar_index = 1;
            } else {
                var ar_index = 0;
            }
            search_payload['body']['query']['filtered']['filter']['and']['ar_index'] = {
                'terms': {
                    'topic_name_simple': TOPIC_LIST
                }
            };
        } else {
            var search_payload = $this.SEARCH_PAYLOAD('default');
        }
        return search_payload;
    },
    // start initially in app.js; start and stop stream whenever selecting or canceling city/topic
    FIRE_FILTER(CITY_LIST, TOPIC_LIST) {
        const $this = this;
        $this.FROM = 0;
        const streaming = this.GET_STREAMING_CLIENT();
        var search_payload = this.GET_PAYLOAD(CITY_LIST, TOPIC_LIST);
        delete search_payload.stream;
        return streaming.search(search_payload);

        console.log(JSON.stringify(search_payload));
        $('#record-container').html('');

        console.log('reinstantiating...');
        console.log('search_payload');

    },
    FILTER_PAYLOAD(method) {
        const field = method === 'city' ? 'group_city_simple' : 'topic_name_simple';
        const payload = {
            'size': "0",
            'query': {
                'range': {
                    'mtime': {
                        'gte': new Date().setMonth(new Date().getMonth() - 1)
                    }
                }
            },
            'aggs': {
                'city': {
                    'terms': {
                        'field': field,
                        'order': {
                            '_count': 'desc'
                        },
                        'size': 0
                    }
                }
            }
        };
        return payload;
    },
    SEARCH_PAYLOAD(method) {
        const $this = this;
        if (method === 'default') {
            var obj = {
                type: 'meetup',
                size: $this.PAGE_SIZE,
                body: {
                    'query': {
                        'match_all': {}
                    },
                    'sort': [{
                        'rsvp_id': {
                            'order': 'desc'
                        }
                    }]
                }
            };
        } else if (method === 'filter') {
            var obj = {
                type: 'meetup',
                stream: true,
                size: $this.PAGE_SIZE,
                body: {
                    'query': {
                        'filtered': {
                            'query': {
                                'match_all': {}
                            },
                            'filter': {
                                'and': []
                            }
                        }
                    },
                    'sort': [{
                        'rsvp_id': {
                            'order': 'desc'
                        }
                    }]
                }
            };
        }
        return obj;
    },
    PAGINATION(CITY_LIST, TOPIC_LIST) {
        const $this = this;
        $this.FROM += $this.PAGE_SIZE;
        const search_payload = this.GET_PAYLOAD(CITY_LIST, TOPIC_LIST);
        delete search_payload.stream;
        const search_payload_pagination = search_payload['body'];
        search_payload_pagination['size'] = $this.PAGE_SIZE;
        search_payload_pagination['from'] = $this.FROM;
        request_data = JSON.stringify(search_payload_pagination);
        const credentials = $this.USERNAME + ':' + this.PASSWORD;
        return jQuery.ajax({
            type: 'POST',
            beforeSend: function(request){
                request.setRequestHeader('Authorization', 'Basic', btoa(credentials));
            },
            'url': $this.FILTER_URL,
            dataType: 'json',
            contentType: 'application/json',
            data: request_data
        })
    },
    // get list of city or topic
    GET_TAG_LIST(method, callback) {
        const request_data = this.FILTER_PAYLOAD(method);
        this.GET_STREAMING_CLIENT().search({
            type: 'meetup',
            body: request_data
        }).on('data', function(res){
            callback(res);
        });
    }
}
