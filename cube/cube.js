/**
 * jQuery Plugin CubeSlider 2.2
 * http://www.albanx.com/cubeslider
 *
 * Copyright 2013, www.albanx.com/cubeslider
 *
 * Date: 24-4-2014
 */

(function (f, h) {
    function k(b) {
        var a, c, d = b.charAt(0).toUpperCase() + b.slice(1), e = ["Moz", "Webkit", "O", "ms"], g = document.createElement("div");
        if (b in g.style)c = b; else for (var s = 0; s < e.length; s++)if (a = e[s] + d, a in g.style) {
            c = a;
            break
        }
        return f.support[b] = c
    }

    function w() {
        var b = window.navigator.userAgent, a = b.indexOf("MSIE "), c = b.indexOf("Trident/");
        return 0 < a ? parseInt(b.substring(a + 5, b.indexOf(".", a)), 10) : 0 < c ? (a = b.indexOf("rv:"), parseInt(b.substring(a + 3, b.indexOf(".", a)), 10)
    ):
        !1
    }

    var u = function (b, a) {
        this.height = this.width = 0;
        this.slider = b;
        this.items = b.children();
        this.images = b.find("img");
        this.wrapper = this.slider.wrap('<div class="cs-container"></div>').parent();
        this.settings = a;
        this.currItem = 0;
        this.cubes = [];
        this.cssProps = this.animBox = null;
        this.mode3d = k("Perspective") !== h && ("auto" === a.mode3d || a.mode3d);
        this.animating = !1;
        this.prevItem = this.currItem = 0;
        this.numItems = this.items.length;
        this.numCubes = 0;
        this.mode3d && (this.mode3d = !w());
        this.items.hide().eq(this.currItem).show();
        b.append('<div class="cs-loader" />').addClass("cs-slider").css({overflow: "hidden", width: "100%"});
        this.imageLoad()
    };
    u.prototype = {
        imageLoad: function () {
            for (var b = this, a = b.images, c = 0; c < a.length; c++) {
                var d = a[c];
                if (d.width === h || d.complete !== h && !d.complete)return setTimeout(function () {
                    b.imageLoad()
                }, 50), !1
            }
            b.init()
        }, init: function () {
            this.slider.css({overflow: "visible"}).children(".cs-loader").remove();
            this.wrapper.css({overflow: "visible", position: "relative"});
            this.cssDetect();
            this.setSize();
            this.settings.addShadow && f('<div class="cs-shadow"/>').appendTo(this.wrapper);
            this.addNagivation();
            this.addArrows();
            this.addPlayButton();
            this.addEvents();
            this.createTitles();
            this.images.css({"max-width": "100%"});
            this.slider.css({"max-width": this.width});
            this.wrapper.css({"max-width": this.width + 2 * this.prevNav.width()});
            this.mode3d || (this.items.hide(), this.items.eq(this.currItem).show(), this.slider.css({overflow: "hidden"}));
            this.startSlide(!0)
        }, cssDetect: function () {
            var b = {};
            b.BF = k("backfaceVisibility");
            b.TS = k("transformStyle");
            b.PE = k("perspective");
            b.TR = k("transform");
            this.cssProps = b
        }, filter: function () {
            this.rows = 0 === this.rows % 2 ? this.rows++ : this.rows;
            this.cols = 0 === this.cols % 2 ? this.cols++ : this.cols
        }, setSize: function () {
            this.width = this.images.eq(this.currItem).width();
            this.height = this.images.eq(this.currItem).height()
        }, addEvents: function () {
            var b = this;
            f(window).on("resize", function (a) {
                b.setSize();
                b.setArrowPos()
            });
            this.navContainer.on("click", "span", this, function (a) {
                a = a.data;
                if (a.animating && !a.mode3d)return !1;
                var b = a.navContainer.children("span").index(this);
                a.slideTo(0 < b - a.currItem ? 1 : -1, b)
            });
            this.prevNav.on("click", this, function (a) {
                clearTimeout(a.data.slideTimer);
                a.data.slideTo(-1)
            });
            this.nextNav.on("click", this, function (a) {
                clearTimeout(a.data.slideTimer);
                a.data.slideTo(1)
            });
            this.playButton.on("click", this, function (a) {
                a = a.data;
                a.settings.autoplay ? a.stopPlay() : a.startPlay()
            })
        }, startPlay: function () {
            this.settings.autoplay = !0;
            this.startSlide();
            this.playButton.addClass("cs-nav-stop")
        }, stopPlay: function () {
            clearTimeout(this.slideTimer);
            this.settings.autoplay = !1;
            this.playButton.removeClass("cs-nav-stop")
        }, addNagivation: function () {
            var b = "";
            this.navContainer = f('<div class="cs-nav-cont" />').appendTo(this.wrapper).css({position: "absolute"});
            for (var a = 0; a < this.numItems; a++)b += "<span></span>";
            this.navContainer.append(b).children(":first").addClass("cs-current");
            !0 !== this.settings.navigation && this.navContainer.hide()
        }, addArrows: function () {
            this.prevNav = f('<span class="cs-nav-prev"></span>').appendTo(this.wrapper);
            this.nextNav = f('<span class="cs-nav-next"></span>').appendTo(this.wrapper);
            this.setArrowPos();
            this.settings.arrows || (this.prevNav.hide(), this.nextNav.hide())
        }, setArrowPos: function () {
            var b = (-this.prevNav.height() + this.slider.height()) / 2;
            this.prevNav.css("top", b);
            this.nextNav.css("top", b)
        }, addPlayButton: function () {
            this.playButton = f('<span class="cs-nav-play"></span>').appendTo(this.wrapper);
            this.settings.play || this.playButton.hide();
            this.settings.autoplay && this.playButton.addClass("cs-nav-stop")
        }, createTitles: function () {
            this.items.each(function () {
                var b = f(this);
                if (0 == b.find(".cs-title").length)if (b.attr("title") !== h && "" != b.attr("title")) {
                    var a = f("<span />").addClass("cs-title").html(b.attr("title"));
                    a.insertAfter(b);
                    b.data("title", a)
                } else b.data("title", !1); else b.data("title", b.find(".cs-title"))
            })
        }, startSlide: function (b) {
            var a = this;
            b && this.showTitle(this.items.eq(this.currItem));
            this.settings.autoplay && (this.slideTimer = setTimeout(function () {
                a.slideTo(1)
            }, this.settings.autoplayInterval))
        }, slideTo: function (b, a) {
            this.animating && this.mode3d || (this.animating = !0, this.prevItem = this.currItem, this.currItem += b, this.currItem > this.numItems - 1 && (this.currItem = 0), 0 > this.currItem && (this.currItem = this.numItems - 1), a !== h && (this.currItem = a), this.slider.find(".cs-title").hide(), this.mode3d ? (this.createCubes(b), this.rotateCubes()) : this.slideNormal(b), this.navContainer.children("span").removeClass("cs-current").eq(this.currItem).addClass("cs-current"))
        }, slideNormal: function (b) {
            this.slider.css({height: this.height});
            var a = this, c = this.items.eq(this.prevItem).show(), d = this.items.eq(this.currItem).hide();
            c.css({position: "absolute", top: 0, left: 0});
            d.css({position: "absolute", top: 0, left: 0});
            var e = {};
            "v" === this.settings.orientation ? (e.top = b * this.height + "px", d.css("top", -b * this.height + "px")) : "h" === this.settings.orientation && (e.left = -b * this.width + "px", d.css("left", b * this.width + "px"));
            c.stop().animate(e, this.settings.animationSpeed, this.settings.fallbackEasing);
            d.show().stop().animate({
                top: 0,
                left: 0
            }, this.settings.animationSpeed, this.settings.fallbackEasing, function () {
                f(this).css({position: "relative", display: "block"});
                a.slider.css({height: "auto"});
                c.hide();
                a.showTitle(d);
                a.onFinish()
            })
        }, showTitle: function (b) {
            b.data("title") && b.data("title").slideDown(this.settings.titleSpeed, this.settings.titleEasing)
        }, rotateCubes: function () {
            this.items.eq(this.prevItem).hide();
            this.items.find(".cs-title").hide();
            for (var b = this, a = 0; a < this.numCubes; ++a)this.cubes[a].rotate(a, b.currItem, function (a) {
                a === b.numCubes - 1 && (b.slider.css("overflow", "hidden"), b.animBox.remove(), b.showTitle(b.items.eq(b.currItem).css("display", "block")), b.onFinish())
            })
        }, createCubes: function (b) {
            this.numCubes = 0;
            this.cubes = [];
            var a = this.settings.orientation;
            a || (a = 0 === Math.floor(2 * Math.random()) ? "v" : "h");
            "object" == typeof this.settings.cubesNum ? (this.rows = this.settings.cubesNum.rows, this.cols = this.settings.cubesNum.cols) : "h" == this.orientation ? (this.rows = this.settings.cubesNum, this.cols = 1) : (this.rows = 1, this.cols = this.settings.cubesNum);
            this.settings.random && (this.rows = Math.floor(Math.random() * this.rows + 1), this.cols = Math.floor(Math.random() * this.cols + 1), a = 0.5 > Math.random() ? "v" : "h");
            this.filter();
            var c = {};
            c.width = this.width;
            c.height = this.height;
            c.position = "relative";
            c[this.cssProps.PE] = this.settings.perspective + "px";
            this.animBox = f("<div />").css(c).appendTo(this.slider);
            this.slider.css("overflow", "visible");
            b = {
                width: this.width,
                height: this.height,
                orientation: a,
                css: this.cssProps,
                images: this.images,
                rows: this.rows,
                cols: this.cols,
                dir: b,
                settings: this.settings
            };
            for (a = 0; a < this.rows; a++)for (c = 0; c < this.cols; c++) {
                var d = new v(b, a, c), e = d.createCube(this.prevItem);
                this.cubes.push(d);
                this.animBox.append(e);
                this.numCubes++
            }
        }, onFinish: function () {
            this.animating = !1;
            this.settings.autoplay && this.startSlide(!1);
            "function" == typeof this.settings.onFinish && this.settings.onFinish.call(this)
        }
    };
    var v = function (b, a, c) {
        this.settings = b.settings;
        this.css3Props = b.css;
        this.orientation = b.orientation;
        this.rows = b.rows;
        this.cols = b.cols;
        this.stageWidth = b.width;
        this.stageHeight = b.height;
        this.dir = b.dir;
        this.images = b.images;
        this.face = 1;
        this.row = a;
        this.col = c;
        this.setSize(a, c);
        this.setCubeStyle()
    };
    v.prototype = {
        setSize: function (b, a) {
            this.width = Math.floor(this.stageWidth / this.cols);
            this.height = Math.floor(this.stageHeight / this.rows);
            this.gapw = this.stageWidth - this.width * this.cols;
            this.gaph = this.stageHeight - this.height * this.rows;
            this.y = this.height * b;
            this.x = this.width * a
        }, setCubeStyle: function () {
            var b = this.settings, a = this.width / 2, c = this.height / 2, d = "X", e = c, g = "rotateZ( 180deg )", f = 0, h = 0, l = this.width;
            "v" === this.orientation ? (e = c, h = a - c, d = "X", l = this.height):(e = a, g = "", f = c - a, d = "Y", l = this.width);
            var k = {}, r = {}, m = {}, n = {}, p = {}, q = {};
            k.width = this.width + this.gapw;
            k.height = this.height + this.gaph;
            k["background-color"] = b.backfacesColor;
            k[this.css3Props.TR] = "rotate3d( 0, 1, 0, 0deg ) translate3d( 0, 0, " + e + "px )";
            r.width = this.width;
            r.height = this.height;
            r["background-color"] = b.backfacesColor;
            r[this.css3Props.TR] = "rotate3d( 0, 1, 0, 180deg ) translate3d( 0, 0, " + e + "px ) " + g;
            m.width = l;
            m.height = this.height + this.gaph;
            m["background-color"] = b.backfacesColor;
            m[this.css3Props.TR] = "rotate3d( 0, 1, 0, 90deg ) translate3d( 0, 0, " + a + "px )";
            m.left = h;
            n.width = l;
            n.height = this.height + this.gaph;
            n["background-color"] = b.backfacesColor;
            n[this.css3Props.TR] = "rotate3d( 0, 1, 0, -90deg ) translate3d( 0, 0, " + a + "px )";
            n.left = h;
            p.width = this.width + this.gapw;
            p.height = l;
            p["background-color"] = b.backfacesColor;
            p[this.css3Props.TR] = "rotate3d( 1, 0, 0, 90deg ) translate3d( 0, 0, " + c + "px )";
            p.top = f;
            q.width = this.width + this.gapw;
            q.height = l;
            q["background-color"] = b.backfacesColor;
            q[this.css3Props.TR] = "rotate3d( 1, 0, 0, -90deg ) translate3d( 0, 0, " + c + "px )";
            q.top = f;
            this.faceStyles = {front: k, back: r, left: n, right: m, top: p, bottom: q};
            this.showFace = ["translateZ(-" + e + "px )", "translateZ(-" + e + "px ) rotate" + d + "(-90deg )", "translateZ(-" + e + "px ) rotate" + d + "(-180deg )", "translateZ(-" + e + "px ) rotate" + d + "(-270deg )"]
        }, createCube: function (b) {
            var a = Math.ceil(this.rows / 2), c = Math.ceil(this.cols / 2), d = this.settings.animationSpeed, e = this.settings.easing, g = this.faceStyles, d = {
                "-webkit-transition": "-webkit-transform " + d + "ms " + e,
                "-moz-transition": "-moz-transform " + d + "ms " + e,
                "-o-transition": "-o-transform " + d + "ms " + e,
                "-ms-transition": "-ms-transform " + d + "ms " + e,
                transition: "transform " + d + "ms " + e,
                width: this.width,
                height: this.height,
                position: "absolute",
                "z-index": 100 * ((this.row < a ? this.row + 1 : this.rows - this.row) + (this.col < c ? this.col + 1 : this.cols - this.col)),
                left: this.x,
                top: this.y
            };
            d[this.css3Props.TS] = "preserve-3d";
            d[this.css3Props.BF] = "hidden";
            d[this.css3Props.TR] = this.showFace[0];
            g = f("<div />").css(d).append(f("<div/>").addClass("cube-face").css(g.front)).append(f("<div/>").addClass("cube-face").css(g.back)).append(f("<div/>").addClass("cube-face").css(g.right)).append(f("<div/>").addClass("cube-face").css(g.left)).append(f("<div/>").addClass("cube-face").css(g.top)).append(f("<div/>").addClass("cube-face").css(g.bottom));
            g.children("div").css("background-size", this.stageWidth + "px, " + this.stageHeight + "px");
            this.cube = g;
            this.changeImage(b);
            this.spreadPixel = this.settings.spreadPixel * (this.col + this.row + 2 - c - a);
            return g
        }, changeImage: function (b) {
            var a;
            switch (this.face) {
                case 1:
                    a = 0;
                    break;
                case 2:
                    a = "v" === this.orientation ? 4 : 2;
                    break;
                case 3:
                    a = 1;
                    break;
                case 4:
                    a = "v" === this.orientation ? 5 : 3
            }
            this.cube.children().eq(a).css({
                "background-image": "url(" + this.images.eq(b).attr("src") + ")",
                "background-position": "-" + this.x + "px -" + this.y + "px"
            })
        }, rotate: function (b, a, c) {
            var d = this.settings, e = this, g = this.css3Props;
            setTimeout(function () {
                var f = 0 < e.dir ? 2 : 4;
                e.face = f;
                f = e.showFace[f - 1];
                e.changeImage(a);
                var h = {}, k = {};
                "v" === e.orientation ? (h.left = "+=" + e.spreadPixel + "px", k.left = "-=" + e.spreadPixel + "px") : "h" === e.orientation && (h.top = "+=" + e.spreadPixel + "px", k.top = "-=" + e.spreadPixel + "px");
                e.cube.css(g.TR, f).animate(h, d.animationSpeed / 2).animate(k, d.animationSpeed / 2, function () {
                    c && c.call(this, b)
                })
            }, d.cubeSync * b)
        }
    };
    var x = {
        orientation: "v",
        perspective: 1200,
        cubesNum: {rows: 1, cols: 1},
        random: !1,
        spreadPixel: 0,
        backfacesColor: "#222",
        cubeSync: 100,
        animationSpeed: 800,
        easing: "ease",
        fallbackEasing: "easeOutExpo",
        autoplay: !1,
        autoplayInterval: 2E3,
        mode3d: "auto",
        arrows: !0,
        navigation: !0,
        addShadow: !0,
        play: !0,
        titleSpeed: 300,
        titleEasing: "easeOutExpo"
    }, t = {
        init: function (b) {
            return this.each(function () {
                var a = f.extend({}, x, b), c = f(this);
                c.data("CS") === h && (c.data("author", "http://www.albanx.com/"), c.data("CS", new u(c, a)))
            })
        }, enable: function () {
            return this.each(function () {
                f(this).data("CS").enable(!0)
            })
        }, disable: function () {
            return this.each(function () {
                f(this).data("CS").enable(!1)
            })
        }, destroy: function () {
            return this.each(function () {
                var b = f(this);
                b.data("CS");
                b.removeData("CS")
            })
        }, option: function (b, a) {
            return this.each(function () {
                return f(this).data("CS").options(b, a)
            })
        }
    };
    f.fn.cubeslider = function (b, a) {
        if (t[b])return t[b].apply(this, Array.prototype.slice.call(arguments, 1));
        if ("object" !== typeof b && b)f.error("Method " + b + " does not exist on jQuery.CubeSlider"); else return t.init.apply(this, arguments)
    };
    f.easing.jswing = f.easing.swing;
    f.extend(f.easing, {
        def: "easeOutQuad", swing: function (b, a, c, d, e) {
            return f.easing[f.easing.def](b, a, c, d, e)
        }, easeInQuad: function (b, a, c, d, e) {
            return d * (a /= e) * a + c
        }, easeOutQuad: function (b, a, c, d, e) {
            return -d * (a /= e) * (a - 2) + c
        }, easeInOutQuad: function (b, a, c, d, e) {
            return 1 > (a /= e / 2) ? d / 2 * a * a + c : -d / 2 * (--a * (a - 2) - 1) + c
        }, easeInCubic: function (b, a, c, d, e) {
            return d * (a /= e) * a * a + c
        }, easeOutCubic: function (b, a, c, d, e) {
            return d * ((a = a / e - 1) * a * a + 1) + c
        }, easeInOutCubic: function (b, a, c, d, e) {
            return 1 > (a /= e / 2) ? d / 2 * a * a * a + c : d / 2 * ((a -= 2) * a * a + 2) + c
        }, easeInQuart: function (b, a, c, d, e) {
            return d * (a /= e) * a * a * a + c
        }, easeOutQuart: function (b, a, c, d, e) {
            return -d * ((a = a / e - 1) * a * a * a - 1) + c
        }, easeInOutQuart: function (b, a, c, d, e) {
            return 1 > (a /= e / 2) ? d / 2 * a * a * a * a + c : -d / 2 * ((a -= 2) * a * a * a - 2) + c
        }, easeInQuint: function (b, a, c, d, e) {
            return d * (a /= e) * a * a * a * a + c
        }, easeOutQuint: function (b, a, c, d, e) {
            return d * ((a = a / e - 1) * a * a * a * a + 1) + c
        }, easeInOutQuint: function (b, a, c, d, e) {
            return 1 > (a /= e / 2) ? d / 2 * a * a * a * a * a + c : d / 2 * ((a -= 2) * a * a * a * a + 2) + c
        }, easeInSine: function (b, a, c, d, e) {
            return -d * Math.cos(a / e * (Math.PI / 2)) + d + c
        }, easeOutSine: function (b, a, c, d, e) {
            return d * Math.sin(a / e * (Math.PI / 2)) + c
        }, easeInOutSine: function (b, a, c, d, e) {
            return -d / 2 * (Math.cos(Math.PI * a / e) - 1) + c
        }, easeInExpo: function (b, a, c, d, e) {
            return 0 == a ? c : d * Math.pow(2, 10 * (a / e - 1)) + c
        }, easeOutExpo: function (b, a, c, d, e) {
            return a == e ? c + d : d * (-Math.pow(2, -10 * a / e) + 1) + c
        }, easeInOutExpo: function (b, a, c, d, e) {
            return 0 == a ? c : a == e ? c + d : 1 > (a /= e / 2) ? d / 2 * Math.pow(2, 10 * (a - 1)) + c : d / 2 * (-Math.pow(2, -10 * --a) + 2) + c
        }, easeInCirc: function (b, a, c, d, e) {
            return -d * (Math.sqrt(1 - (a /= e) * a) - 1) + c
        }, easeOutCirc: function (b, a, c, d, e) {
            return d * Math.sqrt(1 - (a = a / e - 1) * a) + c
        }, easeInOutCirc: function (b, a, c, d, e) {
            return 1 > (a /= e / 2) ? -d / 2 * (Math.sqrt(1 - a * a) - 1) + c : d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
        }, easeInElastic: function (b, a, c, d, e) {
            b = 1.70158;
            var g = 0, f = d;
            if (0 == a)return c;
            if (1 == (a /= e))return c + d;
            g || (g = 0.3 * e);
            f < Math.abs(d) ? (f = d, b = g / 4):b= g / (2 * Math.PI) * Math.asin(d / f);
            return -(f * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a * e - b) * Math.PI / g)) + c
        }, easeOutElastic: function (b, a, c, d, e) {
            b = 1.70158;
            var g = 0, f = d;
            if (0 == a)return c;
            if (1 == (a /= e))return c + d;
            g || (g = 0.3 * e);
            f < Math.abs(d) ? (f = d, b = g / 4):b= g / (2 * Math.PI) * Math.asin(d / f);
            return f * Math.pow(2, -10 * a) * Math.sin(2 * (a * e - b) * Math.PI / g) + d + c
        }, easeInOutElastic: function (b, a, c, d, e) {
            b = 1.70158;
            var g = 0, f = d;
            if (0 == a)return c;
            if (2 == (a /= e / 2))return c + d;
            g || (g = 0.3 * e * 1.5);
            f < Math.abs(d) ? (f = d, b = g / 4):b= g / (2 * Math.PI) * Math.asin(d / f);
            return 1 > a ? -0.5 * f * Math.pow(2, 10 * (a -= 1)) * Math.sin(2 * (a * e - b) * Math.PI / g) + c : f * Math.pow(2, -10 * (a -= 1)) * Math.sin(2 * (a * e - b) * Math.PI / g) * 0.5 + d + c
        }, easeInBack: function (b, a, c, d, e, f) {
            f == h && (f = 1.70158);
            return d * (a /= e) * a * ((f + 1) * a - f) + c
        }, easeOutBack: function (b, a, c, d, e, f) {
            f == h && (f = 1.70158);
            return d * ((a = a / e - 1) * a * ((f + 1) * a + f) + 1) + c
        }, easeInOutBack: function (b, a, c, d, e, f) {
            f == h && (f = 1.70158);
            return 1 > (a /= e / 2) ? d / 2 * a * a * (((f *= 1.525) + 1) * a - f) + c : d / 2 * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + c
        }, easeInBounce: function (b, a, c, d, e) {
            return d - f.easing.easeOutBounce(b, e - a, 0, d, e) + c
        }, easeOutBounce: function (b, a, c, d, e) {
            return (a /= e) < 1 / 2.75 ? 7.5625 * d * a * a + c : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
        }, easeInOutBounce: function (b, a, c, d, e) {
            return a < e / 2 ? 0.5 * f.easing.easeInBounce(b, 2 * a, 0, d, e) + c : 0.5 * f.easing.easeOutBounce(b, 2 * a - e, 0, d, e) + 0.5 * d + c
        }
    })
})(jQuery);