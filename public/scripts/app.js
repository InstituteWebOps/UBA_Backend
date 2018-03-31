var main_app = new Vue({
    el: '#main',
    data: {
        isLoading  : true,
        number_of_data : 0,
        data_list : null,
        isFetching : false
    },
    methods: {
        show_data : function(_id) {
            window.location = "/show_each_data/"+_id;
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
            giftofspeed.alt = "UBA icon";
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
        get_all_data: function () {
            this.isFetching = !this.isFetching;
            axios.get(window.location.origin+'/api/read/data/')
                .then(function (response) {
                    main_app.isFetching = !main_app.isFetching;
                    main_app.data_list = response.data;
                })
                .catch(function (error) {
                    main_app.isFetching = !main_app.isFetching;
                    alert("Network error!")
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
        check_mobile :function() {
            if( navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ){
                console.log("this is a mobile")
            }
            else {
                this.is_mobile = ! this.is_mobile;
            }
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
        }

    },
    mounted: function () {
        this.load_components();
        this.isLoading = !this.isLoading;
        this.get_numbers();
        this.get_all_data();
    }
});
