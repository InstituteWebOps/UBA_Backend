var main_app = new Vue({
    el: '#main',
    data: {
        isLoading  : true,
        number_of_data : 0,
    },
    methods: {
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
        get_numbers: function(){
            axios.get(window.location.origin+'/api/get_numbers/data')
                .then(function (response) {
                    main_app.number_of_data = parseInt(response.number_of_data);
                    console.log(response.data.number_of_data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    },
    mounted: function () {
        this.load_components();
        this.isLoading = !this.isLoading;
        this.get_numbers();
    }
});