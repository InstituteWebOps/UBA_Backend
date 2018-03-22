var main_app = new Vue({
        el: '#main',
        data: {
            is_showing: false,
            isLoading  : true,
            number_of_data : null,
            data_list : null,
            details : null
        },
        methods: {
            close_data : function () {
              this.is_showing = !this.is_showing;
            },
            download_css: function(src) {
                var giftofspeed = document.createElement('link');
                giftofspeed.rel = 'stylesheet';
                giftofspeed.href = src;
                giftofspeed.type = 'text/css';
                var godefer = document.getElementsByTagName('link')[0];
                godefer.parentNode.insertBefore(giftofspeed, godefer);
            },
            download_icon: function(src) {
                var giftofspeed = document.createElement('link');
                giftofspeed.rel = 'shortcut icon';
                giftofspeed.href = src;
                var godefer = document.getElementsByTagName('link')[0];
                godefer.parentNode.insertBefore(giftofspeed, godefer);
            },
            downloadJSAtOnload : function(src) {
                var element = document.createElement("script");
                element.src = src;
                document.body.appendChild(element);
            },
            download_js :function(src) {
                if (window.addEventListener){
                    window.addEventListener("load", this.downloadJSAtOnload(src), false);
                }
                else if (window.attachEvent){
                    window.attachEvent("onload", this.downloadJSAtOnload(src));
                }
                else window.onload = this.downloadJSAtOnload(src);
            },
            load_components: function(){
                this.download_icon(window.location.origin+"/imges/logo.png");

                this.download_css(window.location.origin+"/stylesheets/style.css");
                this.download_css('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

                this.download_js("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");
                this.download_js("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");
            },
            get_data: function (skip,limit) {
                axios.get(window.location.origin+'/api/read/data/')
                    .then(function (response) {
                        main_app.data_list = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            show_item : function (item) {
                this.is_showing = !this.is_showing;
                axios.get(window.location.origin+'/api/read/data/'+item._id)
                    .then(function (response) {
                        main_app.details = main_app.syntaxHighlight(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            delete_data: function (item) {
                if (confirm("Do you want to delete "+item.submitted_by+"'s data ?")) {
                    axios.get(window.location.origin+'/api/delete/data/'+item._id)
                        .then(function (response) {
                            console.log("data deleted!");
                            location.reload();
                        })
                        .catch(function (error) {
                            alert("network error!");
                        });
                } else {
                    console.log("pressed cancel button");
                }

            },
        syntaxHighlight :function(json) {
            if (typeof json !== 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        },
        get_numbers: function(){
            axios.get(window.location.origin+'/api/get_numbers/data')
                .then(function (response) {
                    main_app.number_of_data = parseInt(response.data.number_of_data);
                    // console.log(response.data.number_of_data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        is_table_needed : function () {
            if (this.data_list.size >0)
                return true;
            else
                return false;
        }

    },
    mounted: function () {
    this.load_components();
    this.isLoading = !this.isLoading;
    this.get_numbers();
    this.get_data(this.skip,this.limit);
}
});