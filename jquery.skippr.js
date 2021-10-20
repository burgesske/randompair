
(function () {    

    var Skippr = (function () {

        function Skippr(element, options) {

        	var _ = this,
                timer;
            
            _.settings = $.extend($.fn.skippr.defaults, options);
            _.$element = $(element);
            _.$parent = _.$element.parent();
            _.$photos = _.$element.children();
			_.count = _.$photos.length;
            _.countString = String(_.count);
			_.init();




    
        }

        Skippr.prototype.init = function() {
        	var _ = this;

        	_.setup();
        	_.navClick();
            _.arrowClick();
            _.resize();
            _.keyPress();

            if(_.settings.autoPlay == true) {
                _.autoPlay();
                _.autoPlayPause();
            }
        }

        Skippr.prototype.setup = function() {
        	var _ = this;
                
            if (_.settings.childrenElementType == 'img') {
                var makeDivs = [];

                for (i = 0; i < _.count; i++) {
                    var src = _.$photos.eq(i).attr('src'),
                        insert = '<div style="background-image: url(' + src + ')"></div>';

                    makeDivs.push(insert);
                }
                 makeDivs.join("");
                 _.$element.append(makeDivs);
                 _.$element.find('img').remove();
                 _.$photos = _.$element.children();
            }

            if (_.settings.transition == 'fade') {
                _.$photos.not(":first-child").hide();
            }

            if (_.settings.transition == 'slide') {
                _.setupSlider();

            }

        	_.$photos.eq(0).addClass('visible');
        	_.$element.addClass('skippr');

        	_.navBuild();

            if(_.settings.arrows == true) {
                _.arrowBuild();
            }

        };

        Skippr.prototype.resize = function() {

            var _ = this;

            if( _.settings.transition == 'slide') {
                
                $(window).resize(function() {
        
                    var currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider');

                    _.setupSlider();

                    _.$photos.each(function() {
                        var amountLeft = parseFloat($(this).css('left')),
                            parentWidth = _.$parent.width(),
                            moveAmount;

                        if( currentItem > 1 ) {
                            moveAmount = amountLeft - (parentWidth * (currentItem - 1));
                        }
                        $(this).css('left', moveAmount + 'px');
                    });

                    // Corrects autoPlay timer
                    if(_.settings.autoPlay === true ) {
                        clearInterval(timer);
                        _.autoPlay();
                    }    

                });
            }
        };

        Skippr.prototype.arrowBuild = function() {

            var _ = this,
                previous,
                next,
                startingPrevious = _.count, // what will be the first previous slide?
                previousStyles = '';

            if ( _.settings.hidePrevious === true ) {
                previousStyles = 'style="display:none;"'; 
            }

            previous = '<nav class="skippr-nav-item skippr-arrow skippr-previous" data-slider="' + startingPrevious + '" ' + previousStyles + '></nav>';
            next = '<nav class="skippr-nav-item skippr-arrow skippr-next" data-slider="2"></nav>';

            _.$element.append(previous + next);

        };

        Skippr.prototype.navBuild = function() {

        	var _ = this,
        		container,
                currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider'), //new add
        		navElements = [];

            //var donothing = 0;

            if (_.settings.navType == "block") {
                var styleClass = "skippr-nav-element-block";
            } 
            else if(_.settings.navType == "bubble") {
               var styleClass = "skippr-nav-element-bubble"; 
            }

        	for (var i = 0; i < _.count; i++) { 
        		//cycle through slideshow divs and display correct number of bubbles.
        		var insert;
                
        		if (i == 0 &&  _.count > 1 ){//&& _.settings.navType == "block") {
        			//check if first bubble, add respective active class.           
        	 		insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + " skippr-nav-element-active' data-slider='" + (i + 1) + "'></div>";  		    
                } else {//if(_.settings.navType == "block") {            
        			insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + "' data-slider='" + (i + 1) + "'></div>";
        		}
                //else if(_.settings.navType == "bubble"){
                //    insert = "<div class='skippr-nav-element skippr-nav-item "  + "skippr-nav-element-block" +"' data-slider='" + (i + 1) + "'>" + (i+1) + '/' + _.count +  "</div>";
                //}
        		//insert bubbles into an array.
        		navElements.push(insert); 
        	};
            
                //join array elements into a single string.
                navElements = navElements.join(""); 
                // append html to bubbles container div.
                container = '<nav class="skippr-nav-container">' + navElements + '</nav>';
               
                _.$element.append(container);
            //}
            
            if (document.getElementById("pic_count")) {
                    document.getElementById("pic_count").parentNode.removeChild(document.getElementById("pic_count"));
                }
        	var obj = document.getElementById('picture');
                var div = document.createElement("div");
                div.id = "pic_count";
                if(_.count == 0)
                {          
                    var newContent = document.createTextNode("0 / 0");
                    div.appendChild(newContent);
                }
                else //if(_.count == 1)
                {  
                    var newContent = document.createTextNode("1 / "+ _.count);
                    div.appendChild(newContent);
                    //new add
                    var obj2 = document.getElementById('picidx');
                    obj2.setAttribute("value", "1");
                    var obj3 = document.getElementById('picallcount');
                    obj3.setAttribute("value", _.count);
                }
            div.setAttribute("style","text-align:center; border:23px;  font-family: Calibri Regular; ");
            obj.appendChild(div);    

        };

        Skippr.prototype.arrowClick = function() {
            
            var _ = this,
                $arrows = _.$element.find(".skippr-arrow");
            
            $arrows.click(function(){
               
                if ( !$(this).hasClass('disabled') ) {
                    _.change($(this));  
                }
                
            });

        };

        Skippr.prototype.navClick = function() {

        	var _ = this,
                $navs = _.$element.find('.skippr-nav-element');

        	$navs.click(function(){

                if ( !$(this).hasClass('disabled') ) {
                    _.change($(this));
                }
        	});

        };

        Skippr.prototype.change = function(element) {

            var _ = this,
                item = element.attr('data-slider'),
                allNavItems = _.$element.find(".skippr-nav-item"),
                currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider'),
                nextData = _.$element.find(".skippr-next").attr('data-slider'),
                previousData = _.$element.find(".skippr-previous").attr('data-slider');

            if(item != currentItem) { //prevents animation for repeat click.

                if (_.settings.transition == 'fade') {
                    _.$photos.eq(item - 1).css('z-index', '10').siblings('div').css('z-index', '9');
                    
                    _.$photos.eq(item - 1).fadeIn(_.settings.speed, function() {
                        _.$element.find(".visible").fadeOut('fast',function(){
                            $(this).removeClass('visible');
                            _.$photos.eq(item - 1).addClass('visible');
                        });
                    }); 
                }

                if (_.settings.transition == 'slide') {                 
                    _.$photos.each(function(){ 
                        var amountLeft = parseFloat($(this).css('left')),
                            parentWidth = _.$parent.width(),
                            moveAmount;

                        if (item > currentItem) {
                            moveAmount = amountLeft - (parentWidth * (item - currentItem)); 
                        }

                        if (item < currentItem) {
                            moveAmount = amountLeft + (parentWidth * (currentItem - item));                           
                        }

                        allNavItems.addClass('disabled');
                        
                        $(this).velocity({'left': moveAmount + 'px'}, _.settings.speed, _.settings.easing, function(){

                            allNavItems.removeClass('disabled');

                        });

                        _.logs("slides sliding");

                    });
                }


                _.$element.find(".skippr-nav-element")
                          .eq(item - 1)
                          .addClass('skippr-nav-element-active')
                          .siblings()
                          .removeClass('skippr-nav-element-active');
                
                var nextDataAddString = Number(item) + 1,
                    previousDataAddString = Number(item) - 1;

                if ( item == _.count ){ 
                    _.$element.find(".skippr-next").attr('data-slider', '1' );
                } else {
                     _.$element.find(".skippr-next").attr('data-slider', nextDataAddString );
                }
                
                if (item == 1) {
                     _.$element.find(".skippr-previous").attr('data-slider', _.countString );
                }  else {
                    _.$element.find(".skippr-previous").attr('data-slider', previousDataAddString ); 
                }

                if( _.settings.arrows && _.settings.hidePrevious ) {
                    _.hidePrevious();
                }    

                if(item <= _.count && item > 0)
                {
                    if (document.getElementById("pic_count")) {
                    document.getElementById("pic_count").parentNode.removeChild(document.getElementById("pic_count"));
                    }
                    var obj = document.getElementById('picture');
                    var div = document.createElement("div");
                    div.id = "pic_count";

                    var newContent = document.createTextNode(item+" / "+_.count); 
                    div.appendChild(newContent);

                    div.setAttribute("style","text-align:center; border:23px;  font-family: Calibri Regular;");
                    obj.appendChild(div);    

                    //new add
                    var obj2 = document.getElementById('picidx');
                    obj2.setAttribute("value", item);
                    var obj3 = document.getElementById('picallcount');
                    obj3.setAttribute("value", _.count);                   
                }
            }

        };

        Skippr.prototype.autoPlay = function() {

            var _ = this;

            timer = setInterval(function(){
                var activeElement =  _.$element.find(".skippr-nav-element-active"),
                    activeSlide = activeElement.attr('data-slider');

                if( activeSlide == _.count ) {
                  var elementToInsert =  _.$element.find(".skippr-nav-element").eq(0); 
                } else {
                    var elementToInsert = activeElement.next();
                }

                _.change(elementToInsert);
                    
            },_.settings.autoPlayDuration);

        };

        Skippr.prototype.autoPlayPause = function() {

            var _ = this;

            // Set up a few listeners to clear and reset the autoPlay timer.

            _.$parent.hover(function(){
                clearInterval(timer);

                _.logs("clearing timer on hover");

            }, function() {
                _.autoPlay();

                _.logs("resetting timer on un-hover");

            });

            // Checks if this tab is not being viewed, and pauses autoPlay timer if not. 
            $(window).on("blur focus", function(e) {

                var prevType = $(this).data("prevType");

                if (prevType != e.type) {   //  reduce double fire issues
                    switch (e.type) {
                        case "blur":
                            clearInterval(timer);
                            _.logs('clearing timer on window blur'); 
                            break;
                        case "focus":
                            _.autoPlay();
                            _.logs('resetting timer on window focus');
                            break;
                    }
                }

                $(this).data("prevType", e.type);
            });

        };

        Skippr.prototype.setupSlider = function() {

            var _ = this,
                parentWidth = _.$parent.width(),
                amountLeft;

            _.$photos.css('position', 'absolute');

            for (i = 0; i < _.count; i++) {

                amountLeft = parentWidth * i;
                _.$photos.eq(i).css('left', amountLeft);
            }


        }

        Skippr.prototype.keyPress = function() {

            var _ = this;

            if(_.settings.keyboardOnAlways == true) {

                $(document).on('keydown', function(e) {
                    if(e.which == 39) {
                         _.$element.find(".skippr-next").trigger('click');
                    }
                    if(e.which == 37) {
                         _.$element.find(".skippr-previous").trigger('click');
                    }

                });
            }

            if (_.settings.keyboardOnAlways == false) {

                _.$parent.hover(function(){

                    $(document).on('keydown', function(e) {
                        if(e.which == 39) {
                             _.$element.find(".skippr-next").trigger('click');
                        }
                        if(e.which == 37) {
                             _.$element.find(".skippr-previous").trigger('click');
                        }

                    });
                    
                }, function(){
                    $(document).off('keydown');
                });
            }
            
        }

        Skippr.prototype.hidePrevious = function() {

            var _ = this;

            if ( _.$element.find(".skippr-nav-element").eq(0).hasClass('skippr-nav-element-active')) {
                 _.$element.find(".skippr-previous").fadeOut();
            } else {
                 _.$element.find(".skippr-previous").fadeIn();
            }
        }

        Skippr.prototype.logs = function(message) {

            var _ = this;

            _.settings.logs === true && console.log(message);
        }



        return Skippr;

    })();

    $.fn.skippr = function (options) {

        var instance;

        instance = this.data('skippr');
        if (!instance) {
            return this.each(function () {
                return $(this).data('skippr', new Skippr(this,options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') instance[options]();
        return this;
    };

    $.fn.skippr.defaults = {
        transition: 'slide',
        speed: 1000,
        easing: 'easeOutQuart',
        navType: 'block',
        childrenElementType : 'div',
        arrows: true,
        autoPlay: false,
        autoPlayDuration: 5000,
        keyboardOnAlways: true,
        hidePrevious: false,
        logs: false
       
    };

}).call(this);


!function(a,b,c,d){function e(a){for(var b=-1,c=a?a.length:0,d=[];++b<c;){var e=a[b];e&&d.push(e)}return d}function f(a){return"[object Function]"===Object.prototype.toString.call(a)}function g(a){var b=Object.prototype.toString.call(a);return"object"==typeof a&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(b)&&a.length!==d&&(0===a.length||"object"==typeof a[0]&&a[0].nodeType>0)}function h(a){return a.jquery||b.Zepto&&b.Zepto.zepto.isZ(a)}function i(a,b){var c=a;return"string"==typeof a?s.Easings[a]||(c=!1):c=q(a)&&2===a.length?u.apply(null,a.concat([b])):q(a)&&4===a.length?t.apply(null,a):!1,c===!1&&(c=s.Easings[s.defaults.easing]?s.defaults.easing:n),c}function j(a){if(a)for(var b=(new Date).getTime(),c=0,e=s.State.calls.length;e>c;c++)if(s.State.calls[c]){var f=s.State.calls[c],g=f[0],h=f[2],i=f[3];i||(i=s.State.calls[c][3]=b-16);for(var m=Math.min((b-i)/h.duration,1),n=0,o=g.length;o>n;n++){var q=g[n],t=q.element;if(r.data(t,l)){var u=!1;h.display&&"none"!==h.display&&v.setPropertyValue(t,"display",h.display);for(var w in q)if("element"!==w){var x,y=q[w],z="string"==typeof y.easing?s.Easings[y.easing]:y.easing;if(x=1===m?y.endValue:y.startValue+(y.endValue-y.startValue)*z(m),y.currentValue=x,v.Hooks.registered[w]){var A=v.Hooks.getRoot(w),B=r.data(t,l).rootPropertyValueCache[A];B&&(y.rootPropertyValue=B)}var C=v.setPropertyValue(t,w,y.currentValue+(0===parseFloat(x)?"":y.unitType),y.rootPropertyValue,y.scrollData);v.Hooks.registered[w]&&(r.data(t,l).rootPropertyValueCache[A]=v.Normalizations.registered[A]?v.Normalizations.registered[A]("extract",null,C[1]):C[1]),"transform"===C[0]&&(u=!0)}h.mobileHA&&r.data(t,l).transformCache.translate3d===d&&(r.data(t,l).transformCache.translate3d="(0px, 0px, 0px)",u=!0),u&&v.flushTransformCache(t)}}h.display&&"none"!==h.display&&(s.State.calls[c][2].display=!1),1===m&&k(c)}s.State.isTicking&&p(j)}function k(a){for(var b=s.State.calls[a][0],c=s.State.calls[a][1],e=s.State.calls[a][2],f=!1,g=0,h=b.length;h>g;g++){var i=b[g].element;if("none"!==e.display||e.loop||v.setPropertyValue(i,"display",e.display),(r.queue(i)[1]===d||!/\.velocityQueueEntryFlag/i.test(r.queue(i)[1]))&&r.data(i,l)){r.data(i,l).isAnimating=!1,r.data(i,l).rootPropertyValueCache={};var j,k=["transformPerspective","translateZ","rotateX","rotateY"],m=!1;for(var n in k)j=k[n],/^\(0[^.]/.test(r.data(i,l).transformCache[j])&&(m=!0,delete r.data(i,l).transformCache[j]);e.mobileHA&&(m=!0,delete r.data(i,l).transformCache.translate3d),m&&v.flushTransformCache(i)}if(g===h-1&&!e.loop&&e.complete){var o=c.jquery?c.get():c;e.complete.call(o,o)}e.queue!==!1&&r.dequeue(i,e.queue)}s.State.calls[a]=!1;for(var p=0,q=s.State.calls.length;q>p;p++)if(s.State.calls[p]!==!1){f=!0;break}f===!1&&(s.State.isTicking=!1,delete s.State.calls,s.State.calls=[])}var l="velocity",m=400,n="swing",o=function(){if(c.documentMode)return c.documentMode;for(var a=7;a>4;a--){var b=c.createElement("div");if(b.innerHTML="<!--[if IE "+a+"]><span></span><![endif]-->",b.getElementsByTagName("span").length)return b=null,a}return d}(),p=b.requestAnimationFrame||function(){var a=0;return b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||function(b){var c,d=(new Date).getTime();return c=Math.max(0,16-(d-a)),a=d+c,setTimeout(function(){b(d+c)},c)}}(),q=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},r=b.jQuery||a.Velocity&&a.Velocity.Utilities;if(!r)throw new Error("Velocity: Either jQuery or Velocity's jQuery shim must first be loaded.");if(a.Velocity!==d&&!a.Velocity.Utilities)throw new Error("Velocity: Namespace is occupied.");if(7>=o){if(b.jQuery)return void(b.jQuery.fn.velocity=b.jQuery.fn.animate);throw new Error("Velocity: For IE<=7, Velocity falls back to jQuery, which must first be loaded.")}if(8===o&&!b.jQuery)throw new Error("Velocity: For IE8, Velocity requires jQuery to be loaded. (Velocity's jQuery shim does not work with IE8.)");var s=a.Velocity=a.velocity=r.extend(a.Velocity||{},{State:{isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),isAndroid:/Android/i.test(navigator.userAgent),isGingerbread:/Android 2\.3\.[3-7]/i.test(navigator.userAgent),prefixElement:c.createElement("div"),prefixMatches:{},scrollAnchor:null,scrollPropertyLeft:null,scrollPropertyTop:null,isTicking:!1,calls:[]},CSS:{},Utilities:{},Sequences:{},Easings:{},defaults:{queue:"",duration:m,easing:n,complete:null,display:null,loop:!1,delay:!1,mobileHA:!0,_cacheValues:!0},animate:function(){},debug:!1});b.pageYOffset!==d?(s.State.scrollAnchor=b,s.State.scrollPropertyLeft="pageXOffset",s.State.scrollPropertyTop="pageYOffset"):(s.State.scrollAnchor=c.documentElement||c.body.parentNode||c.body,s.State.scrollPropertyLeft="scrollLeft",s.State.scrollPropertyTop="scrollTop");var t=function(){function a(a,b){return 1-3*b+3*a}function b(a,b){return 3*b-6*a}function c(a){return 3*a}function d(d,e,f){return((a(e,f)*d+b(e,f))*d+c(e))*d}function e(d,e,f){return 3*a(e,f)*d*d+2*b(e,f)*d+c(e)}return function(a,b,c,f){function g(b){for(var f=b,g=0;8>g;++g){var h=e(f,a,c);if(0===h)return f;var i=d(f,a,c)-b;f-=i/h}return f}if(4!==arguments.length)return!1;for(var h=0;4>h;++h)if("number"!=typeof arguments[h]||isNaN(arguments[h])||!isFinite(arguments[h]))return!1;return a=Math.min(a,1),c=Math.min(c,1),a=Math.max(a,0),c=Math.max(c,0),function(e){return a===b&&c===f?e:d(g(e),b,f)}}}(),u=function(){function a(a){return-a.tension*a.x-a.friction*a.v}function b(b,c,d){var e={x:b.x+d.dx*c,v:b.v+d.dv*c,tension:b.tension,friction:b.friction};return{dx:e.v,dv:a(e)}}function c(c,d){var e={dx:c.v,dv:a(c)},f=b(c,.5*d,e),g=b(c,.5*d,f),h=b(c,d,g),i=1/6*(e.dx+2*(f.dx+g.dx)+h.dx),j=1/6*(e.dv+2*(f.dv+g.dv)+h.dv);return c.x=c.x+i*d,c.v=c.v+j*d,c}return function d(a,b,e){var f,g,h,i={x:-1,v:0,tension:null,friction:null},j=[0],k=0,l=1e-4,m=.016;for(a=parseFloat(a)||600,b=parseFloat(b)||20,e=e||null,i.tension=a,i.friction=b,f=null!==e,f?(k=d(a,b),g=k/e*m):g=m;;)if(h=c(h||i,g),j.push(1+h.x),k+=16,!(Math.abs(h.x)>l&&Math.abs(h.v)>l))break;return f?function(a){return j[a*(j.length-1)|0]}:k}}();!function(){s.Easings.linear=function(a){return a},s.Easings.swing=function(a){return.5-Math.cos(a*Math.PI)/2},s.Easings.ease=t(.25,.1,.25,1),s.Easings["ease-in"]=t(.42,0,1,1),s.Easings["ease-out"]=t(0,0,.58,1),s.Easings["ease-in-out"]=t(.42,0,.58,1);var a={};r.each(["Quad","Cubic","Quart","Quint","Expo"],function(b,c){a[c]=function(a){return Math.pow(a,b+2)}}),r.extend(a,{Sine:function(a){return 1-Math.cos(a*Math.PI/2)},Circ:function(a){return 1-Math.sqrt(1-a*a)},Elastic:function(a){return 0===a||1===a?a:-Math.pow(2,8*(a-1))*Math.sin((80*(a-1)-7.5)*Math.PI/15)},Back:function(a){return a*a*(3*a-2)},Bounce:function(a){for(var b,c=4;a<((b=Math.pow(2,--c))-1)/11;);return 1/Math.pow(4,3-c)-7.5625*Math.pow((3*b-2)/22-a,2)}}),r.each(a,function(a,b){s.Easings["easeIn"+a]=b,s.Easings["easeOut"+a]=function(a){return 1-b(1-a)},s.Easings["easeInOut"+a]=function(a){return.5>a?b(2*a)/2:1-b(-2*a+2)/2}}),s.Easings.spring=function(a){return 1-Math.cos(4.5*a*Math.PI)*Math.exp(6*-a)}}();var v=s.CSS={RegEx:{valueUnwrap:/^[A-z]+\((.*)\)$/i,wrappedValueAlreadyExtracted:/[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,valueSplit:/([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi},Hooks:{templates:{color:["Red Green Blue Alpha","255 255 255 1"],backgroundColor:["Red Green Blue Alpha","255 255 255 1"],borderColor:["Red Green Blue Alpha","255 255 255 1"],borderTopColor:["Red Green Blue Alpha","255 255 255 1"],borderRightColor:["Red Green Blue Alpha","255 255 255 1"],borderBottomColor:["Red Green Blue Alpha","255 255 255 1"],borderLeftColor:["Red Green Blue Alpha","255 255 255 1"],outlineColor:["Red Green Blue Alpha","255 255 255 1"],textShadow:["Color X Y Blur","black 0px 0px 0px"],boxShadow:["Color X Y Blur Spread","black 0px 0px 0px 0px"],clip:["Top Right Bottom Left","0px 0px 0px 0px"],backgroundPosition:["X Y","0% 0%"],transformOrigin:["X Y Z","50% 50% 0%"],perspectiveOrigin:["X Y","50% 50%"]},registered:{},register:function(){var a,b,c;if(o)for(a in v.Hooks.templates){b=v.Hooks.templates[a],c=b[0].split(" ");var d=b[1].match(v.RegEx.valueSplit);"Color"===c[0]&&(c.push(c.shift()),d.push(d.shift()),v.Hooks.templates[a]=[c.join(" "),d.join(" ")])}for(a in v.Hooks.templates){b=v.Hooks.templates[a],c=b[0].split(" ");for(var e in c){var f=a+c[e],g=e;v.Hooks.registered[f]=[a,g]}}},getRoot:function(a){var b=v.Hooks.registered[a];return b?b[0]:a},cleanRootPropertyValue:function(a,b){return v.RegEx.valueUnwrap.test(b)&&(b=b.match(v.Hooks.RegEx.valueUnwrap)[1]),v.Values.isCSSNullValue(b)&&(b=v.Hooks.templates[a][1]),b},extractValue:function(a,b){var c=v.Hooks.registered[a];if(c){var d=c[0],e=c[1];return b=v.Hooks.cleanRootPropertyValue(d,b),b.toString().match(v.RegEx.valueSplit)[e]}return b},injectValue:function(a,b,c){var d=v.Hooks.registered[a];if(d){var e,f,g=d[0],h=d[1];return c=v.Hooks.cleanRootPropertyValue(g,c),e=c.toString().match(v.RegEx.valueSplit),e[h]=b,f=e.join(" ")}return c}},Normalizations:{registered:{clip:function(a,b,c){switch(a){case"name":return"clip";case"extract":var d;return v.RegEx.wrappedValueAlreadyExtracted.test(c)?d=c:(d=c.toString().match(v.RegEx.valueUnwrap),d=d?d[1].replace(/,(\s+)?/g," "):c),d;case"inject":return"rect("+c+")"}},opacity:function(a,b,c){if(8>=o)switch(a){case"name":return"filter";case"extract":var d=c.toString().match(/alpha\(opacity=(.*)\)/i);return c=d?d[1]/100:1;case"inject":return b.style.zoom=1,parseFloat(c)>=1?"":"alpha(opacity="+parseInt(100*parseFloat(c),10)+")"}else switch(a){case"name":return"opacity";case"extract":return c;case"inject":return c}}},register:function(){function a(a){var b,c=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,d=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;return a=a.replace(c,function(a,b,c,d){return b+b+c+c+d+d}),b=d.exec(a),b?"rgb("+(parseInt(b[1],16)+" "+parseInt(b[2],16)+" "+parseInt(b[3],16))+")":"rgb(0 0 0)"}var b=["translateX","translateY","scale","scaleX","scaleY","skewX","skewY","rotateZ"];9>=o||s.State.isGingerbread||(b=b.concat(["transformPerspective","translateZ","scaleZ","rotateX","rotateY"]));for(var c=0,e=b.length;e>c;c++)!function(){var a=b[c];v.Normalizations.registered[a]=function(b,c,e){switch(b){case"name":return"transform";case"extract":return r.data(c,l).transformCache[a]===d?/^scale/i.test(a)?1:0:r.data(c,l).transformCache[a].replace(/[()]/g,"");case"inject":var f=!1;switch(a.substr(0,a.length-1)){case"translate":f=!/(%|px|em|rem|\d)$/i.test(e);break;case"scal":case"scale":s.State.isAndroid&&r.data(c,l).transformCache[a]===d&&(e=1),f=!/(\d)$/i.test(e);break;case"skew":f=!/(deg|\d)$/i.test(e);break;case"rotate":f=!/(deg|\d)$/i.test(e)}return f||(r.data(c,l).transformCache[a]="("+e+")"),r.data(c,l).transformCache[a]}}}();for(var f=["color","backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","outlineColor"],c=0,g=f.length;g>c;c++)!function(){var b=f[c];v.Normalizations.registered[b]=function(c,e,f){switch(c){case"name":return b;case"extract":var g;if(v.RegEx.wrappedValueAlreadyExtracted.test(f))g=f;else{var h,i={aqua:"rgb(0, 255, 255);",black:"rgb(0, 0, 0)",blue:"rgb(0, 0, 255)",fuchsia:"rgb(255, 0, 255)",gray:"rgb(128, 128, 128)",green:"rgb(0, 128, 0)",lime:"rgb(0, 255, 0)",maroon:"rgb(128, 0, 0)",navy:"rgb(0, 0, 128)",olive:"rgb(128, 128, 0)",purple:"rgb(128, 0, 128)",red:"rgb(255, 0, 0)",silver:"rgb(192, 192, 192)",teal:"rgb(0, 128, 128)",white:"rgb(255, 255, 255)",yellow:"rgb(255, 255, 0)"};/^[A-z]+$/i.test(f)?h=i[f]!==d?i[f]:i.black:/^#([A-f\d]{3}){1,2}$/i.test(f)?h=a(f):/^rgba?\(/i.test(f)||(h=i.black),g=(h||f).toString().match(v.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g," ")}return 8>=o||3!==g.split(" ").length||(g+=" 1"),g;case"inject":return 8>=o?4===f.split(" ").length&&(f=f.split(/\s+/).slice(0,3).join(" ")):3===f.split(" ").length&&(f+=" 1"),(8>=o?"rgb":"rgba")+"("+f.replace(/\s+/g,",").replace(/\.(\d)+(?=,)/g,"")+")"}}}()}},Names:{camelCase:function(a){return a.replace(/-(\w)/g,function(a,b){return b.toUpperCase()})},prefixCheck:function(a){if(s.State.prefixMatches[a])return[s.State.prefixMatches[a],!0];for(var b=["","Webkit","Moz","ms","O"],c=0,d=b.length;d>c;c++){var e;if(e=0===c?a:b[c]+a.replace(/^\w/,function(a){return a.toUpperCase()}),"string"==typeof s.State.prefixElement.style[e])return s.State.prefixMatches[a]=e,[e,!0]}return[a,!1]}},Values:{isCSSNullValue:function(a){return 0==a||/^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)},getUnitType:function(a){return/^(rotate|skew)/i.test(a)?"deg":/(^(scale|scaleX|scaleY|scaleZ|opacity|alpha|fillOpacity|flexGrow|flexHeight|zIndex|fontWeight)$)|color/i.test(a)?"":"px"},getDisplayType:function(a){var b=a.tagName.toString().toLowerCase();return/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b)?"inline":/^(li)$/i.test(b)?"list-item":/^(tr)$/i.test(b)?"table-row":"block"}},getPropertyValue:function(a,c,e,f){function g(a,c){var e=0;if(8>=o)e=r.css(a,c);else{if(!f){if("height"===c&&"border-box"!==v.getPropertyValue(a,"boxSizing").toString().toLowerCase())return a.offsetHeight-(parseFloat(v.getPropertyValue(a,"borderTopWidth"))||0)-(parseFloat(v.getPropertyValue(a,"borderBottomWidth"))||0)-(parseFloat(v.getPropertyValue(a,"paddingTop"))||0)-(parseFloat(v.getPropertyValue(a,"paddingBottom"))||0);if("width"===c&&"border-box"!==v.getPropertyValue(a,"boxSizing").toString().toLowerCase())return a.offsetWidth-(parseFloat(v.getPropertyValue(a,"borderLeftWidth"))||0)-(parseFloat(v.getPropertyValue(a,"borderRightWidth"))||0)-(parseFloat(v.getPropertyValue(a,"paddingLeft"))||0)-(parseFloat(v.getPropertyValue(a,"paddingRight"))||0)}var h;h=r.data(a,l)===d?b.getComputedStyle(a,null):r.data(a,l).computedStyle?r.data(a,l).computedStyle:r.data(a,l).computedStyle=b.getComputedStyle(a,null),o&&"borderColor"===c&&(c="borderTopColor"),e=9===o&&"filter"===c?h.getPropertyValue(c):h[c],(""===e||null===e)&&(e=a.style[c])}if("auto"===e&&/^(top|right|bottom|left)$/i.test(c)){var i=g(a,"position");("fixed"===i||"absolute"===i&&/top|left/i.test(c))&&(e=r(a).position()[c]+"px")}return e}var h;if(v.Hooks.registered[c]){var i=c,j=v.Hooks.getRoot(i);e===d&&(e=v.getPropertyValue(a,v.Names.prefixCheck(j)[0])),v.Normalizations.registered[j]&&(e=v.Normalizations.registered[j]("extract",a,e)),h=v.Hooks.extractValue(i,e)}else if(v.Normalizations.registered[c]){var k,m;k=v.Normalizations.registered[c]("name",a),"transform"!==k&&(m=g(a,v.Names.prefixCheck(k)[0]),v.Values.isCSSNullValue(m)&&v.Hooks.templates[c]&&(m=v.Hooks.templates[c][1])),h=v.Normalizations.registered[c]("extract",a,m)}return/^[\d-]/.test(h)||(h=g(a,v.Names.prefixCheck(c)[0])),v.Values.isCSSNullValue(h)&&(h=0),s.debug>=2&&console.log("Get "+c+": "+h),h},setPropertyValue:function(a,c,d,e,f){var g=c;if("scroll"===c)f.container?f.container["scroll"+f.direction]=d:"Left"===f.direction?b.scrollTo(d,f.alternateValue):b.scrollTo(f.alternateValue,d);else if(v.Normalizations.registered[c]&&"transform"===v.Normalizations.registered[c]("name",a))v.Normalizations.registered[c]("inject",a,d),g="transform",d=r.data(a,l).transformCache[c];else{if(v.Hooks.registered[c]){var h=c,i=v.Hooks.getRoot(c);e=e||v.getPropertyValue(a,i),d=v.Hooks.injectValue(h,d,e),c=i}if(v.Normalizations.registered[c]&&(d=v.Normalizations.registered[c]("inject",a,d),c=v.Normalizations.registered[c]("name",a)),g=v.Names.prefixCheck(c)[0],8>=o)try{a.style[g]=d}catch(j){console.log("Error setting ["+g+"] to ["+d+"]")}else a.style[g]=d;s.debug>=2&&console.log("Set "+c+" ("+g+"): "+d)}return[g,d]},flushTransformCache:function(a){var b,c,d,e="";for(b in r.data(a,l).transformCache)c=r.data(a,l).transformCache[b],"transformPerspective"!==b?(9===o&&"rotateZ"===b&&(b="rotate"),e+=b+c+" "):d=c;d&&(e="perspective"+d+" "+e),v.setPropertyValue(a,"transform",e)}};v.Hooks.register(),v.Normalizations.register(),s.animate=function(){function a(){function a(){function a(a){var c=d,e=d,h=d;return q(a)?(c=a[0],!q(a[1])&&/^[\d-]/.test(a[1])||f(a[1])?h=a[1]:("string"==typeof a[1]||q(a[1]))&&(e=i(a[1],g.duration),a[2]&&(h=a[2]))):c=a,e=e||g.easing,f(c)&&(c=c.call(b,x,w)),f(h)&&(h=h.call(b,x,w)),[c||0,e,h]}function m(a,b){var c,d;return d=(b||0).toString().toLowerCase().replace(/[%A-z]+$/,function(a){return c=a,""}),c||(c=v.Values.getUnitType(a)),[d,c]}function t(){var a={parent:b.parentNode,position:v.getPropertyValue(b,"position"),fontSize:v.getPropertyValue(b,"fontSize")},d=a.position===D.lastPosition&&a.parent===D.lastParent,e=a.fontSize===D.lastFontSize&&a.parent===D.lastParent;D.lastParent=a.parent,D.lastPosition=a.position,D.lastFontSize=a.fontSize,null===D.remToPxRatio&&(D.remToPxRatio=parseFloat(v.getPropertyValue(c.body,"fontSize"))||16);var f={overflowX:null,overflowY:null,boxSizing:null,width:null,minWidth:null,maxWidth:null,height:null,minHeight:null,maxHeight:null,paddingLeft:null},g={},h=10;if(g.remToPxRatio=D.remToPxRatio,o)var i=/^auto$/i.test(b.currentStyle.width),j=/^auto$/i.test(b.currentStyle.height);d&&e||(f.overflowX=v.getPropertyValue(b,"overflowX"),f.overflowY=v.getPropertyValue(b,"overflowY"),f.boxSizing=v.getPropertyValue(b,"boxSizing"),f.width=v.getPropertyValue(b,"width",null,!0),f.minWidth=v.getPropertyValue(b,"minWidth"),f.maxWidth=v.getPropertyValue(b,"maxWidth")||"none",f.height=v.getPropertyValue(b,"height",null,!0),f.minHeight=v.getPropertyValue(b,"minHeight"),f.maxHeight=v.getPropertyValue(b,"maxHeight")||"none",f.paddingLeft=v.getPropertyValue(b,"paddingLeft")),d?(g.percentToPxRatioWidth=D.lastPercentToPxWidth,g.percentToPxRatioHeight=D.lastPercentToPxHeight):(v.setPropertyValue(b,"overflowX","hidden"),v.setPropertyValue(b,"overflowY","hidden"),v.setPropertyValue(b,"boxSizing","content-box"),v.setPropertyValue(b,"width",h+"%"),v.setPropertyValue(b,"minWidth",h+"%"),v.setPropertyValue(b,"maxWidth",h+"%"),v.setPropertyValue(b,"height",h+"%"),v.setPropertyValue(b,"minHeight",h+"%"),v.setPropertyValue(b,"maxHeight",h+"%")),e?g.emToPxRatio=D.lastEmToPx:v.setPropertyValue(b,"paddingLeft",h+"em"),d||(g.percentToPxRatioWidth=D.lastPercentToPxWidth=(parseFloat(v.getPropertyValue(b,"width",null,!0))||1)/h,g.percentToPxRatioHeight=D.lastPercentToPxHeight=(parseFloat(v.getPropertyValue(b,"height",null,!0))||1)/h),e||(g.emToPxRatio=D.lastEmToPx=(parseFloat(v.getPropertyValue(b,"paddingLeft"))||1)/h);for(var k in f)null!==f[k]&&v.setPropertyValue(b,k,f[k]);return o?(i&&v.setPropertyValue(b,"width","auto"),j&&v.setPropertyValue(b,"height","auto")):(v.setPropertyValue(b,"height","auto"),f.height!==v.getPropertyValue(b,"height",null,!0)&&v.setPropertyValue(b,"height",f.height),v.setPropertyValue(b,"width","auto"),f.width!==v.getPropertyValue(b,"width",null,!0)&&v.setPropertyValue(b,"width",f.width)),s.debug>=1&&console.log("Unit ratios: "+JSON.stringify(g),b),g}if(0===x&&p&&f(p.begin)){var u=k.jquery?k.get():k;p.begin.call(u,u)}if("scroll"===A){var y,z,B,C=/^x$/i.test(g.axis)?"Left":"Top",F=parseFloat(g.offset)||0;g.container?g.container.jquery||g.container.nodeType?(g.container=g.container[0]||g.container,y=g.container["scroll"+C],B=y+r(b).position()[C.toLowerCase()]+F):g.container=null:(y=s.State.scrollAnchor[s.State["scrollProperty"+C]],z=s.State.scrollAnchor[s.State["scrollProperty"+("Left"===C?"Top":"Left")]],B=r(b).offset()[C.toLowerCase()]+F),h={scroll:{rootPropertyValue:!1,startValue:y,currentValue:y,endValue:B,unitType:"",easing:g.easing,scrollData:{container:g.container,direction:C,alternateValue:z}},element:b}}else if("reverse"===A){if(!r.data(b,l).tweensContainer)return void r.dequeue(b,g.queue);"none"===r.data(b,l).opts.display&&(r.data(b,l).opts.display="block"),r.data(b,l).opts.loop=!1,r.data(b,l).opts.begin=null,r.data(b,l).opts.complete=null,p.easing||delete g.easing,p.duration||delete g.duration,g=r.extend({},r.data(b,l).opts,g);var G=r.extend(!0,{},r.data(b,l).tweensContainer);for(var H in G)if("element"!==H){var I=G[H].startValue;G[H].startValue=G[H].currentValue=G[H].endValue,G[H].endValue=I,p&&(G[H].easing=g.easing)}h=G}else if("start"===A){var G;r.data(b,l).tweensContainer&&r.data(b,l).isAnimating===!0&&(G=r.data(b,l).tweensContainer);for(var J in n){var K=a(n[J]),L=K[0],M=K[1],N=K[2];J=v.Names.camelCase(J);var O=v.Hooks.getRoot(J),P=!1;if(v.Names.prefixCheck(O)[1]!==!1||v.Normalizations.registered[O]!==d){g.display&&"none"!==g.display&&/opacity|filter/.test(J)&&!N&&0!==L&&(N=0),g._cacheValues&&G&&G[J]?(N===d&&(N=G[J].endValue+G[J].unitType),P=r.data(b,l).rootPropertyValueCache[O]):v.Hooks.registered[J]?N===d?(P=v.getPropertyValue(b,O),N=v.getPropertyValue(b,J,P)):P=v.Hooks.templates[O][1]:N===d&&(N=v.getPropertyValue(b,J));var Q,R,S,T;Q=m(J,N),N=Q[0],S=Q[1],Q=m(J,L),L=Q[0].replace(/^([+-\/*])=/,function(a,b){return T=b,""}),R=Q[1],N=parseFloat(N)||0,L=parseFloat(L)||0;var U;if("%"===R&&(/^(fontSize|lineHeight)$/.test(J)?(L/=100,R="em"):/^scale/.test(J)?(L/=100,R=""):/(Red|Green|Blue)$/i.test(J)&&(L=L/100*255,R="")),/[\/*]/.test(T))R=S;else if(S!==R&&0!==N)if(0===L)R=S;else{U=U||t();var V=/margin|padding|left|right|width|text|word|letter/i.test(J)||/X$/.test(J)?"x":"y";switch(S){case"%":N*="x"===V?U.percentToPxRatioWidth:U.percentToPxRatioHeight;break;case"em":N*=U.emToPxRatio;break;case"rem":N*=U.remToPxRatio;break;case"px":}switch(R){case"%":N*=1/("x"===V?U.percentToPxRatioWidth:U.percentToPxRatioHeight);break;case"em":N*=1/U.emToPxRatio;break;case"rem":N*=1/U.remToPxRatio;break;case"px":}}switch(T){case"+":L=N+L;break;case"-":L=N-L;break;case"*":L=N*L;break;case"/":L=N/L}h[J]={rootPropertyValue:P,startValue:N,currentValue:N,endValue:L,unitType:R,easing:M},s.debug&&console.log("tweensContainer ("+J+"): "+JSON.stringify(h[J]),b)}else s.debug&&console.log("Skipping ["+O+"] due to a lack of browser support.")}h.element=b}h.element&&(E.push(h),r.data(b,l).tweensContainer=h,r.data(b,l).opts=g,r.data(b,l).isAnimating=!0,x===w-1?(s.State.calls.length>1e4&&(s.State.calls=e(s.State.calls)),s.State.calls.push([E,k,g]),s.State.isTicking===!1&&(s.State.isTicking=!0,j())):x++)}var b=this,g=r.extend({},s.defaults,p),h={};if("stop"===A)return r.queue(b,"string"==typeof p?p:"",[]),!0;switch(r.data(b,l)===d&&r.data(b,l,{isAnimating:!1,computedStyle:null,tweensContainer:null,rootPropertyValueCache:{},transformCache:{}}),/^\d/.test(g.delay)&&g.queue!==!1&&r.queue(b,g.queue,function(a){s.velocityQueueEntryFlag=!0,setTimeout(a,parseFloat(g.delay))}),g.duration.toString().toLowerCase()){case"fast":g.duration=200;break;case"normal":g.duration=m;break;case"slow":g.duration=600;break;default:g.duration=parseFloat(g.duration)||1}g.easing=i(g.easing,g.duration),p&&p.complete&&!f(p.complete)&&(p.complete=null),g.display&&(g.display=g.display.toString().toLowerCase()),g.mobileHA=g.mobileHA&&s.State.isMobile&&!s.State.isGingerbread,g.queue===!1?g.delay?setTimeout(a,g.delay):a():r.queue(b,g.queue,function(b){s.velocityQueueEntryFlag=!0,a(b)}),""!==g.queue&&"fx"!==g.queue||"inprogress"===r.queue(b)[0]||r.dequeue(b)}var b,k,n,p,t=arguments[0]&&arguments[0].properties!==d,u=h(this);u?(k=this,b=0):(k=t?arguments[0].elements:arguments[0],k=h(k)?[].slice.call(k):k,b=1),t?(n=arguments[0].properties,p=arguments[0].options):(n=arguments[b],p=arguments[b+1]);var w=g(k)||q(k)?k.length:1,x=0;if("stop"!==n&&!r.isPlainObject(p)){var y=b+1;p={};for(var z=y;z<arguments.length;z++)!q(arguments[z])&&/^\d/.test(arguments[z])?p.duration=parseFloat(arguments[z]):"string"==typeof arguments[z]?p.easing=arguments[z]:!q(arguments[z])||2!==arguments[z].length&&4!==arguments[z].length?f(arguments[z])&&(p.complete=arguments[z]):p.easing=arguments[z]}var A;switch(n){case"scroll":A="scroll";break;case"reverse":A="reverse";break;case"stop":A="stop";break;default:if(!r.isPlainObject(n)||r.isEmptyObject(n)){if("string"==typeof n&&s.Sequences[n]){var B=k,C=p.duration;return p.backwards===!0&&(k=(k.jquery?[].slice.call(k):k).reverse()),r.each(k,function(a,b){parseFloat(p.stagger)&&(p.delay=parseFloat(p.stagger)*a),p.drag&&(p.duration=parseFloat(C)||(/^(callout|transition)/.test(n)?1e3:m),p.duration=Math.max(p.duration*(p.backwards?1-a/w:(a+1)/w),.75*p.duration,200)),s.Sequences[n].call(b,b,p||{},a,w)}),B}return console.log("First argument was not a property map, a known action, or a registered sequence. Aborting."),k}A="start"}var D={lastParent:null,lastPosition:null,lastFontSize:null,lastPercentToPxWidth:null,lastPercentToPxHeight:null,lastEmToPx:null,remToPxRatio:null},E=[];if(u)k.each(a);else if(1===w&&k.nodeType)a.call(k);else for(var F in k)k[F].nodeType&&a.call(k[F]);var G,H=r.extend({},s.defaults,p);if(H.loop=parseInt(H.loop),G=2*H.loop-1,H.loop)for(var I=0;G>I;I++){var J={delay:H.delay};H.complete&&I===G-1&&(J.complete=H.complete),u?k.velocity("reverse",J):s.animate(k,"reverse",J)}return k};var w=b.jQuery||b.Zepto;w?(w.fn.velocity=s.animate,w.fn.velocity.defaults=s.defaults):"undefined"!=typeof define&&define.amd?define(function(){return s}):"undefined"!=typeof module&&module.exports&&(module.exports=s),r.each(["Down","Up"],function(a,b){s.Sequences["slide"+b]=function(a,c){var d=r.extend({},c),e={height:null,marginTop:null,marginBottom:null,paddingTop:null,paddingBottom:null,overflow:null,overflowX:null,overflowY:null},f=d.begin,g=d.complete,h=!1;d.display="Down"===b?d.display||"block":d.display||"none",d.begin=function(){function c(){a.style.display="block",e.height=s.CSS.getPropertyValue(a,"height"),a.style.height="auto",s.CSS.getPropertyValue(a,"height")===e.height&&(h=!0),s.CSS.setPropertyValue(a,"height",e.height+"px")}if("Down"===b){e.overflow=[s.CSS.getPropertyValue(a,"overflow"),0],e.overflowX=[s.CSS.getPropertyValue(a,"overflowX"),0],e.overflowY=[s.CSS.getPropertyValue(a,"overflowY"),0],a.style.overflow="hidden",a.style.overflowX="visible",a.style.overflowY="hidden",c();for(var d in e)/^overflow/.test(d)||(e[d]=[s.CSS.getPropertyValue(a,d),0]);a.style.display="none"}else{c();for(var d in e)e[d]=[0,s.CSS.getPropertyValue(a,d)];a.style.overflow="hidden",a.style.overflowX="visible",a.style.overflowY="hidden"}f&&f.call(a,a)},d.complete=function(a){var c="Down"===b?0:1;h===!0?e.height[c]="auto":e.height[c]+="px";for(var d in e)a.style[d]=e[d][c];g&&g.call(a,a)},s.animate(a,e,d)}}),r.each(["In","Out"],function(a,b){s.Sequences["fade"+b]=function(a,c,d,e){var f=r.extend({},c),g={opacity:"In"===b?1:0};d!==e-1&&(f.complete=f.begin=null),null!==f.display&&(f.display="In"===b?s.CSS.Values.getDisplayType(a):"none"),s.animate(this,g,f)}})}(window.jQuery||window.Zepto||window,window,document);