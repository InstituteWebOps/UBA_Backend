var main_app=new Vue({el:"#main",data:{is_showing:!1,isLoading:!0,number_of_data:null,data_list:null,details:null,is_mobile:!0},methods:{close_data:function(){this.is_showing=!this.is_showing},download_css:function(t){var n=document.createElement("link");n.rel="stylesheet",n.href=t,n.type="text/css";var o=document.getElementsByTagName("link")[0];o.parentNode.insertBefore(n,o)},download_icon:function(t){var n=document.createElement("link");n.rel="shortcut icon",n.href=t;var o=document.getElementsByTagName("link")[0];o.parentNode.insertBefore(n,o)},downloadJSAtOnload:function(t){var n=document.createElement("script");n.src=t,document.body.appendChild(n)},download_js:function(t){window.addEventListener?window.addEventListener("load",this.downloadJSAtOnload(t),!1):window.attachEvent?window.attachEvent("onload",this.downloadJSAtOnload(t)):window.onload=this.downloadJSAtOnload(t)},load_components:function(){this.download_icon(window.location.origin+"/UBA/imges/logo.png"),this.download_css(window.location.origin+"/stylesheets/style.css"),this.download_css("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"),this.download_js("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"),this.download_js("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js")},get_data:function(t,n){axios.get(window.location.origin+"/UBA/api/read/data/").then(function(t){main_app.data_list=t.data}).catch(function(t){console.log(t)})},show_item:function(t){1==this.is_mobile&&(this.is_showing=!this.is_showing),axios.get(window.location.origin+"/api/read/data/"+t._id).then(function(t){main_app.details=main_app.syntaxHighlight(t.data)}).catch(function(t){console.log(t)})},delete_data:function(t){confirm("Do you want to delete "+t.submitted_by+"'s data ?")?axios.get(window.location.origin+"/UBA/api/delete/data/"+t._id).then(function(t){console.log("data deleted!"),location.reload()}).catch(function(t){alert("network error!")}):console.log("pressed cancel button")},check_mobile:function(){navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?console.log("this is a mobile"):this.is_mobile=!this.is_mobile},syntaxHighlight:function(t){return"string"!=typeof t&&(t=JSON.stringify(t,void 0,2)),(t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(t){var n="number";return/^"/.test(t)?n=/:$/.test(t)?"key":"string":/true|false/.test(t)?n="boolean":/null/.test(t)&&(n="null"),'<span class="'+n+'">'+t+"</span>"})},get_numbers:function(){axios.get(window.location.origin+"/api/get_numbers/data").then(function(t){main_app.number_of_data=parseInt(t.data.number_of_data)}).catch(function(t){console.log(t)})},is_table_needed:function(){return this.data_list.size>0}},mounted:function(){this.check_mobile(),this.load_components(),this.isLoading=!this.isLoading,this.get_numbers(),this.get_data(this.skip,this.limit)}});