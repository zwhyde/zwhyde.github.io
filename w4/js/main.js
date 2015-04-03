(function() {
  var baseData = JSON.parse(document.getElementById('profile').value);
  var wrap = document.querySelectorAll('.page');
  var memberData = JSON.parse(document.getElementById('access_user').value);
  var urlRoot = 'http://bxr.im';
  // var theme_url = {
  //    profile:  '/themes/' + baseData.theme_file_name + '/template/profile.html',
  //    wodedongtai:  '/themes/' + baseData.theme_file_name + '/template/wodedongtai.html',
  //    zixun: '/themes/' + baseData.theme_file_name + '/template/zixun.html',
  //    baoxianfuwu: '/themes/' + baseData.theme_file_name + '/template/baoxianfuwu.html',
  //    geiwopingjia: '/themes/' + baseData.theme_file_name + '/template/geiwopingjia.html',
  //    oldpingjia: '/themes/' + baseData.theme_file_name + '/template/oldpingjia.html'
  // };

  var theme_url = {
   profile: baseData.theme_file_name + '/template/profile.html',
   wodedongtai: baseData.theme_file_name + '/template/wodedongtai.html',
   zixun: baseData.theme_file_name + '/template/zixun.html',
   baoxianfuwu: baseData.theme_file_name + '/template/baoxianfuwu.html',
   geiwopingjia: baseData.theme_file_name + '/template/geiwopingjia.html',
   oldpingjia: baseData.theme_file_name + '/template/oldpingjia.html'
  };

  var isWeixin = function(){
    return navigator.userAgent.indexOf("MicroMessenger") > 0
  }

  var bxr_api = {
    //查询所有模块API
    //all: "/api/modules/list?sso_id=" + baseData.xrk_user_id,
    //查询联系方式api
    //ask: "/api/modules/list?module_type=1&sso_id=" + baseData.xrk_user_id,
    //我的服务
    //service: "/api/modules/list?module_type=2&sso_id=" + baseData.xrk_user_id,
    //我的动态
    //message: "/api/modules/list?module_type=3&sso_id=" + baseData.xrk_user_id + "&is_weixin=" + is_weixin,
    //发送验证证码API
    sms: "/api/modules/captcha",
    //提交评论API
    eva: "/api/modules/pingjia"
    //用户基础资料
    //profile: "/api/account/" + profile.xrk_user_id + "/profile"
  };

  if (!baseData.profile.full_image_from_admin && !baseData.profile.image_from_admin ) {
    wrap[0].className = 'page small';
  } else {
    wrap[0].className = 'page med';
  }

  seajs.use(['jqueryform', 'sms_new', 'http://cdn.bootcss.com/jquery.touchswipe/1.6.4/jquery.touchSwipe.js', 'backbone', 'dialog', 'fastclick',
      theme_url.profile, theme_url.wodedongtai, theme_url.zixun, theme_url.baoxianfuwu, theme_url.geiwopingjia, theme_url.oldpingjia],
    function (_form, Sms, _x, Backbone, Dialog, _1, profileTemplate, wodedongtaiTemplate, zixunTemplate, baoxianfuwuTemplate, geiwopingjiaTemplate, oldpingjiaTemplate) {

      $(document).on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      $(function () {
        FastClick.attach(document.body);

        setTimeout(function () {
          $('.load-box').remove();
        }, 500);

        $('.overlay,.mod-nav-windows').on('touchstart', function (e) {
          if ($('.nav-window.active').length) {
            //e.preventDefault();
            e.stopPropagation();
          }
        });

        //关注弹窗
        var gzSettings = {
          "content": "",
          "skin": "dialog-tip",
          "onshow": function() {
            setTimeout(function() {
              gz.close().remove();
            }, 7000);
          }
        }
        if ($('#mark_success').val() === '1') {
          gzSettings.content = '<p>关注成功</p><p>去向日葵保险网<span style="color:#f60">服务号</span>(ID:</p><p>kuiwang2007)查看</p>';
          var gz = Dialog(gzSettings);
          gz.show();
        } else if ($('#mark_success').val() === '0') {
          gzSettings.content = "取消关注成功";
          var gz = Dialog(gzSettings);
          gz.show();
        }

        var showInfo = function() {
          $('.mod-nav-windows').removeClass('show');
          $('.upTips').attr('class','upTips iconfont icon-xiangshang');
          $('.mod-info').removeClass('hide');
          $('.upSec').attr('class','upSec iconfont icon-xiangshang');
        }

        var showNav = function() {
          $('.mod-nav-windows').addClass('show transition');
          $('.mod-info').addClass('hide');
          $('.upTips').attr('class','upTips iconfont icon-xiangxia');
          $('.upSec').attr('class','upSec iconfont icon-xiangxia');
        }

        $(".page").swipe({
          swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'up') {
              showNav();
            }
            if (direction == 'down') {
              showInfo();
            }
          },
          allowPageScroll: "vertical"
        });

        $('body')
          .on('touchstart', '.upTips-box .icon-xiangshang', function() {
            showNav();
          })
          .on('touchstart', '.upTips-box .icon-xiangxia', function() {
            showInfo();
          });

        //弹框
        $('[data-dropdown]').click(function (e) {
          e.preventDefault();
          var id = $(this).data('dropdown');
          if (id) {
            var content = $('#' + id).html();
            var _d = Dialog({
              title: '条件选择',
              content: content,
              okValue: '确定',
              //fixed: true,
              //quickClose:true,
              ok: function () {
              },
              //modal:true,
              skin: 'wz'
            });
            _d.showModal();
          }
        });

        //打分
        $('body').on('touchend', '.pfshow', function() {
          showNav();
          $('.nav-window-pingjia .modal-hd').trigger('touchend');
          return false;
        });

        //评分星星
        $('body').on('touchend', '.nav-window-pingjia .starbox .star-item', function() {
          var $box = $(this).parent();
          var $starnum = $box.parent().find('.star-num');
          $box.find('.star-item').removeClass('active');
          $(this).addClass('active').prevAll('.star-item').addClass('active');

          var fen = $box.find('.active').size();
          $box.parent().find('[name=score]').val(fen);
          $starnum && $starnum.text(fen + '.0');
        });

        //发送短信验证码
        var getSms = function(sso_id, phone) {
          $.ajax({
            url: bxr_api.sms,
            //url: 'http://192.168.9.57:3001' + bxr_api.sms,
            data: {sso_id: sso_id, phone: phone},
            method: 'get',
            dataType: 'jsonp',
            success: function(res) {
              sms.count();
            },
            error: function() {
              $('.btn-captcha').text('重新获取').show();
            }
          });
        }

        //给我评分表单1
        $('body')
          .on('touchend', '#pingfen1 :button', function(e){
            e.preventDefault();
            var dsettings = {
              content: '',
              skin: 'dialog-tip',
              quickClose: true,
              onshow: function() {
                setTimeout(function() {
                  d.close().remove();
                }, 2000);
              }
            };
            var fen = $('.nav-window-pingjia #pingfen1').find('input:hidden').val();
            var pinglun = $('.textareaT').val();
            var phone = $('[name=phone]').val();
            if (!fen) {
              dsettings.content = '请打分';
              var d = Dialog(dsettings);
              d.show();
            } else if (pinglun.length < 3 || pinglun.length >100) {
              dsettings.content = '请填写3-100字评论';
              var d = Dialog(dsettings);
              d.show();
            } else if (!phone) {
              dsettings.content = '请输入手机号码';
              var d = Dialog(dsettings);
              d.show();
            } else if (!/^\d{11}$/.test(phone)) {
              dsettings.content = '请输入正确手机号码';
              var d = Dialog(dsettings);
              d.show();
            } else {
              $(this).parents('.modal-bd').toggleClass('active');
              $('#pingfen2').find('.phoneNum').text(phone);
              if (!$('.btn-captcha').prop('disabled')) {
                getSms(baseData.xrk_user_id, phone);
              }
            }
            return false;
          })
          .on('touchend', '#pingfen2 .btn-back', function(e){
            e.preventDefault();
            $(this).parents('.modal-bd').toggleClass('active');
          });


        //评分表单2
        var submitForm = function(form) {
          var $form = form;
          var settings = {
            content: '',
            skin: 'dialog-tip',
            quickClose: true,
            onshow: ''
          };
          var submitTip = function() {
            settings.onshow = function() {
              setTimeout(function() {
                tip.close().remove();
              }, 2000);
            };
            var tip = Dialog(settings);
            tip.show();
          }
          var options = {
            success: function(res) {
              if(res.code == 201) {
                settings.content = '评分成功';
                submitTip();
                var more = '<a class="more-link green btn" href="'+res.url+'">查看更多评价</a>';
                var $stars = $('.mod-mark-num').next().find('.star-item');
                var lists = [];
                $.each(res.data, function(i,v) {
                  var tpl = [
                    '      <li class="list-item">',
                    '        <div class="list-left">',
                    '          <div class="list-left-img list-left-img-circle text-circle">' + v.display_name + '</div>',
                    '        </div>',
                    '        <div class="list-right">',
                    '          <div class="list-content">',
                    '            <div class="list-content-inner">',
                    '              <div class="list-content-list">',
                    '                <div class="list-content-title">' + v.content + '</div>',
                    '                <time>' + v.date_time + '</time>',
                    '              </div>',
                    '            </div>',
                    '          </div>',
                    '        </div>',
                    '      </li>'
                  ].join("");
                  lists.push(tpl);
                });
                setTimeout(function(){
                  $form.find('#pingfen1 .js-pj-hide').hide();
                  $form.parent('.modal-bd').removeClass('active');
                  $form.find('[name=content]').hide();
                  $form.find('.panel.starbox').removeClass('starbox');
                  $form.find('#pingfen1').append(more);
                  $form.find('.js-pj-show .comment-list').append(lists.join(""));
                  $form.find('.js-pj-show').show();
                  $('.mod-mark-num strong').text(res.score);
                  $stars.removeClass('active').removeClass('half');
                  $.each($stars, function(i, v) {
                    if (i < res.score) {
                      $(v).addClass('active');
                    }
                    if (res.score%1 != 0 && parseInt(res.score) == i) {
                      $(v).addClass('half');
                    }
                  });
                }, 2000);
              } else {
                settings.content = res.msg;
                submitTip();
              }
            },
            error: function(err) {
              settings.content = err.responseJSON.message;
              submitTip();
            },
            complete: function() {
              setTimeout(function() {
                $form.find(':submit').prop('disabled', false);
              }, 5000);
            }
          }
          $form.ajaxSubmit(options);
        }
        $('body').on('submit', '#form-pingjia',function(e) {
          e.preventDefault();
          var $box = $('#form-pingjia');
          var code = $box.find('[name=code]').val();
          var name = $box.find('[name=name]').val();
          var dsettings = {
            content: '',
            skin: 'dialog-tip',
            quickClose: true,
            onshow: function() {
              setTimeout(function() {
                d.close().remove();
              }, 2000);
            }
          };
          if (!code) {
            dsettings.content = '请输入验证码';
            var d = Dialog(dsettings);
            d.show();
          } else if (!name) {
            dsettings.content = '请输入姓名';
            var d = Dialog(dsettings);
            d.show();
          } else if (name.length > 10 || /\d+/.test(name)) {
            dsettings.content = '姓名10个字不含数字';
            var d = Dialog(dsettings);
            d.show();
          } else {
            $box.find(':submit').prop('disabled', true);
            submitForm($box);
          }
        });

        //关注
        var dialog = ['<div style="display: none;" class="layer-wl-guide">    <div class="layer-wl-content">        <p>【关注】的功能需要在</p>        <p>微信中打开才可以使用哦</p>        <div class="close">好的哟</div>    </div></div>'].join("");
        $('body')
          .append(dialog)
          .on('click', '.a-guanzhu', function(e) {
            e.preventDefault();
            if (!isWeixin()) {
              $('.layer-wl-guide').show();
            } else {
              var link = $(this).attr('href');
              window.location.href = link;
            }
          })
          .on('click', '.layer-wl-guide', function() {
            $(this).hide();
          });

        //分享弹层
        var tc = ['<div class="sharePop" style="z-index: 9999;width: 280px;height: 200px;background-color: rgba(0,0,0,0.8);border-radius: 8px;position: absolute;left: 50%;margin-left: -140px;top: 20%;">',
          '   <img src="themes/'+baseData.theme_file_name+'/images/tc.png" alt="" class="shareIcon" style="width: 90px;display: block;margin: 30px auto 14px;">',
          '   <p style="text-align: center;font-size: 20px;color: #61dca0;font-weight: bold;">右上角点击分享给好友！</p>',
          ' </div>'].join("");
        $('body').on('touchend','.a-fenxiang',function(){
          if ($('.sharePop').size() == 0) {
            $(document.body).prepend(tc);
          } else {
            $('.sharePop').remove();
          }
        });
        $('body').on('touchend', function(e){
          if (!$(e.target).hasClass('icon-fenxiang') && $('.sharePop').size()>0) {
            $('.sharePop').remove();
          }
        });

        //更多
        $('body').on('touchend', '.text-more i', function() {
          var $btn = $(this);
          var $overflow = $btn.parent().prev();
          $overflow.toggleClass('overflow');
          if ($btn.hasClass('icon-xiangxia')) {
            $btn.attr('class', 'iconfont icon-xiangshang');
          } else {
            $btn.attr('class', 'iconfont icon-xiangxia');
          }
        });

        //输入框reset
        $('body')
          .on('input', 'input', function() {
            if ($(this).val().length > 0) {
              $(this).next('.btn-reset').show();
            }
          })
          .on('focus', 'input', function() {
            if ($(this).val().length > 0) {
              $(this).next('.btn-reset').show();
            }
          })
          .on('blur', 'input', function() {
            $(this).next('.btn-reset').hide();
          });

        $('body').on('touchend', '.btn-reset', function() {
          $(this).prev('input').val('');
        });

        //backbone模型
        var ProfileModel = Backbone.Model.extend({
          urlRoot: urlRoot,
          defaults: function () {
            return {
              'is_follow': $('#mark_success').val()
            };
          },
          toggle: function () {
            this.save({done: !this.get("done")});
          }
        });

        var ProfileView = Backbone.View.extend({
          id: 'userProfile',
          template: _.template(profileTemplate),
          events: {},
          initialize: function () {
            this.$el.hide();
            this.listenTo(this.model, 'change', this.render);
          },
          render: function () {
            this.$el.html(this.template(this.model.toJSON())).show();
            return this;
          }
        });

        var BaseView = Backbone.View.extend({
          events: {
            'touchend .modal-hd': "show",
            'touchend .modal-del': "hide"
          },
          initialize: function (opts) {
            this.user = opts.user
            this.listenTo(this.model, 'change', this.render);
            this.fetchInfo()
          },
          show:function(e){
            e.stopPropagation();
            $('.nav-window.active').removeClass('active');
            this.$el.addClass('active').parent().addClass('active');
            $('.modal-del .icon-xiangxia').attr('class','iconfont icon-xiangshang');
            $('.active.nav-window').find('.icon-xiangshang').attr('class','iconfont icon-xiangxia');
            $('.overlay.abg').show();
          },
          hide:function(e){
            e.stopPropagation();
            this.$el.removeClass('active').one('webkitTransitionEnd', function () {
              $(this).parent().removeClass('active');
              $('.modal-del .icon-xiangxia').attr('class', 'iconfont icon-xiangshang');
            });
            $('.overlay.abg').hide();
          },
          render: function () {
            return this.$el;
          },
          fetchInfo: function(){
            this.model.remoteInfo(_.bind(function(data){
              // this.$el.html(this.template(this.toJSON()));
              var elClass = '.' + this.$el.attr('class').match(/nav-window-([a-z]+)/)[0];
              $(elClass).replaceWith(this.$el.html(this.template(this.toJSON())));
              this.fetchInfoCallback();
            }, this))
          },
          fetchInfoCallback: function(){

          },
          toJSON: function(){
            return this.model.toJSON();
          }
        });

        var BaseModel = Backbone.Model.extend({
          urlRoot: urlRoot,
          remoteInfo: function(callback){
            this.fetch({
              dataType: 'jsonp',
              url: this.urlRoot + "/api/modules/list",
              data: this.remoteParams(),
              success: function(m, d){
                if(callback) callback(d)
              }
            })
          },
          remoteParams: function(){
            return {
              sso_id: this.get('sso_id'),
              module_type: this.get('module_type')}
          }
        })

        var MesageModel = BaseModel.extend({
          defaults: function () {
            return {
              avatar: baseData.profile.small_header_image
            };
          },
          toggle: function () {
            this.save({done: !this.get("done")});
          },
          remoteParams: function(){
            var data = BaseModel.prototype.remoteParams.apply(this)
            data.is_weixin = (isWeixin() ? 1 : 0)
            if(isWeixin() && memberData.open_id){
              data.openid = memberData.open_id
            }else{
              data.uuid = memberData.uuid
            }
            return data;
          }
        });

        var MesageView = BaseView.extend({
          className: 'modal-box nav-window nav-window-dt',
          template: _.template(wodedongtaiTemplate),
          initialize: function(){
            BaseView.prototype.initialize.apply(this, arguments)
            this.eventsBind();
          },
          eventsBind: function(){
            this.$el.on("touchend", ".list-content-list .a-dianzan", _.bind(this.dianzan, this))
          },
          fetchInfoCallback: function(){
          },
          toJSON: function(){
            var d = this.model.toJSON()
            d.items = this.convertData(d)
            d.avatar_url = this.user.get("profile").small_header_image
            return d
          },
          convertData: function(d){
            var items = [],
              j = 2;

            var tuntract = function(t){
              return t.length > 31 ?  t.substring(0, 31) + "..." : t
            }
            for(var i=0; i<j; i++){
              if(d.wenba.length > i){
                items.push(_.extend({type: 'wenba', header_at: d.wenba[i].answer}, d.wenba[i]))
              }
              if(d.share.length > i){
                items.push(_.extend({type: 'share', header_at: d.share[i].opinion}, d.share[i]))
              }
              if(items.length >= j){
                return items
              }
            }
            return items
          },
          dianzan: function(e){
            e.preventDefault();
            var el = $(e.currentTarget)
            var data = {};
            var that = this;

            data.is_weixin = isWeixin() ? 1 : 0;
            //if(isWeixin() && memberData.open_id){
            //  data.openid = memberData.open_id
            //}else{
            //  data.uuid = memberData.uuid
            //}
            data.uuid = memberData.uuid;
            data.shared_record_id = el.data('shared-record-id');

            $.ajax({
              url: this.model.urlRoot +"/"+ this.user.get("username") +"/dongtai/dianzan?callback=?",
              data: data,
              dataType: "jsonp",
              success: function(res){
                $("span", el).html(res.data.num)
                if(parseInt(res.data.operation) == 0){
                  el.removeClass("gray");
                }else{
                  el.addClass("gray");
                }
              },
              error: function(res){
              },
              complete: function(){
              }
            });
            return false;
          }

        });

        var AskModel = BaseModel.extend({
          defaults: function(){
            return {
            };
          },
          toggle: function () {
            this.save({done: !this.get("done")});
          }
        });

        var AskView = BaseView.extend({
          className: 'modal-box nav-window nav-window-zixun',
          template: _.template(zixunTemplate),
          initialize: function(opts){
            this.data = opts.data
            BaseView.prototype.initialize.apply(this, arguments)
          },
          toJSON:function(){
            return this.model.toJSON();
          }
        });

        var ServiceModel = BaseModel.extend({
          defaults: function () {
            return {
              logo: {
                '个人介绍': 'pic_03',
                '方案定制': 'pic_04',
                '你问我答': 'pic_05'
              }
            };
          },
          toggle: function () {
            this.save({done: !this.get("done")});
          }
        });

        var ServiceView = BaseView.extend({
          className: 'modal-box nav-window nav-window-service',
          template: _.template(baoxianfuwuTemplate)
        });

        var EvaModel = BaseModel.extend({
          defaults: function () {
            return {
              pingjiaURL: bxr_api.eva,
              smsURL: bxr_api.sms,
              sso_id: baseData.xrk_user_id
            };
          },
          toggle: function () {
            this.save({done: !this.get("done")});
          },
          fetchOldPingjia: function(callback){
            $.ajax({
              url: this.urlRoot + "/api/modules/old_pingjia?callback=",
              data: {sso_id: this.get("sso_id")},
              dataType: 'jsonp',
              success: function(data, msg){
                if(callback) callback(data)
              }
            })
          }
        });

        var EvaView = BaseView.extend({
          className: 'modal-box nav-window nav-window-pingjia',
          template: _.template(geiwopingjiaTemplate),
          oldpjTemplate: _.template(oldpingjiaTemplate),
          isPingjia: function(){
            return this.model.get("is_pingjia") == 1
          },
          fetchInfoCallback: function(){
            if(this.isPingjia()){
              this.model.fetchOldPingjia(_.bind(function(data){
                this.$(".content").html(this.oldpjTemplate(data));
              }, this))
            } else {
              window.sms = new Sms({
                button: $('.btn-captcha'),
                second: 60,
                param: {"sso_id": baseData.xrk_user_id},
                success: function(data) {},
                err: function(err) {}
              });
            }

          },
          toJSON: function(){
            var info = this.model.toJSON();
            return _.extend(info, {isPingjia: this.isPingjia()})
          }

        });

        var MenuView = Backbone.Model.extend({
          urlRoot: urlRoot,
          initialize: function(){
          },
          load: function(callback){
            this.fetch({
              dataType: 'jsonp',
              url: this.urlRoot + "/api/modules/list?sso_id="+ this.get("sso_id"),
              success: _.bind(function(m, d){
                if(callback) callback(d)
              }, this)
            })
          }
        })

        var App = Backbone.View.extend({
          initialize: function () {
            this.menu = new MenuView({sso_id: baseData.xrk_user_id})
            this.profileModel = new ProfileModel(baseData);
            this.profileView = new ProfileView({model: this.profileModel});
            this.menu.load(_.bind(this.renderMenu, this));
            this.profileView.render();
          },
          renderMenu: function(items){
            this.$(".mod-nav-windows").empty();
            _.each(items, _.bind(function(item){
              var modules = this.convertMenuView(item.module_name)
              if(modules && modules.length >= 2){
                var m = new modules[1](_.extend({sso_id: baseData.xrk_user_id}, item))
                var v = new modules[0]({user: this.profileModel, data: item, model: m})

                this.$(".mod-nav-windows").append(v.render())
              }else{
                console.error("not exists view!")
                console.error(item)
              }
            }, this))
          },
          convertMenuView: function(module_name){
            var views = {
              "联系咨询": [AskView, AskModel],
              "我的服务": [ServiceView, ServiceModel],
              "我的动态": [MesageView, MesageModel],
              "给我评分": [EvaView, EvaModel]
            }

            return views[module_name]
          },
          render: function () {
            this.$('.page-content').append(this.profileView.el);
          }
        });

        new App({el: $("body>.container")}).render();

        $(document).on("click", "[data-ga]", function(e){
          var value = $(this).data("ga");

          if(typeof gaeventTracker == "undefined") return;

          switch(value){
            case 'fenxiang':
              gaeventTracker('bxr微站','点击数','bxr微站-点击数-bxr-index-分享按钮')
              break;
            case 'guanzhu':
              gaeventTracker('bxr微站','点击数','bxr微站-点击数-bxr-index-关注按钮')
              break;
            case 'dadianhua':
              gaeventTracker('电话咨询','点击数','电话咨询-点击数-bxr-index-Buttom')
              break;
            case 'dafen':
              gaeventTracker('bxr微站','点击数','bxr微站-点击数-bxr-index-打分按钮')
              break;
            case 'dianhuazixun':
              gaeventTracker('电话咨询','点击数','电话咨询-点击数-bxr-index-联系咨询')
              break;
            case 'weiliao-wkt':
              gaeventTracker('微聊C端','点击数','微聊C端-点击数-bxr-index-联系咨询-免费微聊(未开通微聊)')
              break;
            case 'weiliao-kt':
              gaeventTracker('微聊C端','点击数','微聊C端-点击数-bxr-index-联系咨询-免费微聊(开通微聊)')
              break;
            case 'bxfw-你问我答-w':
              gaeventTracker('微聊C端','点击数','微聊C端-点击数-bxr-index-保险服务-免费微聊(未开通微聊)')
              break;
            case 'bxfw-你问我答-z':
              gaeventTracker('微聊C端','点击数','微聊C端-点击数-bxr-index-保险服务-免费微聊(开通微聊)')
              break;

          }
        });

        setTimeout(function(){
          seajs.use('http://assets.xrkcdn.com/global/script/analysis/xrk_ga.js');
        },300);

      });

    });
})();