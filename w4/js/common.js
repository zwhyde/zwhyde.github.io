seajs.use(['jquery', 'dialog', 'sms_new', 'fastclick'],
  function ($, Dialog, Sms) {

    $(function () {
      FastClick.attach(document.body);

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

      var sms = new Sms({
        button: $('.btn-captcha'),
        second: 60,
        param: {"sso_id": $('.btn-pingfen').data('id')},
        success: function(data) {},
        err: function(err) {}
      });


      $('body').on('touchend', '.dialog-pingfen .star-item', function() {
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
          url: '/api/modules/captcha',
          data: {sso_id: sso_id, phone: phone},
          method: 'get',
          dataType: 'json',
          success: function(res) {
            sms.count();
          },
          error: function() {}
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
          var fen = $('#pingfen1').find('input:hidden').val();
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
              getSms($('.btn-pingfen').data('id'), phone);
            }
          }
          return false;
        })
        .on('touchend', '#pingfen2 .btn-back', function(e){
          e.preventDefault();
          $(this).parents('.modal-bd').toggleClass('active');
        });


      //评分表单2
      $('body').on('submit', '#form-pingjia',function(e) {
        e.preventDefault();

        var $box = $('#form-pingjia');
        var code = $box.find('[name=code]').val();
        var name = $box.find('[name=name]').val();
        var $submitBtn = $(this).find('[type=submit]');
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
          $submitBtn.prop('disabled', true);
          $.ajax({
            url: $(this).attr('action'),
            method: 'post',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(res) {
              dsettings.content = res.message;
              var d = Dialog(dsettings);
              d.show();
              if (res.result == 'true') {
                setTimeout(function () {
                  window.location.reload();
                }, 2000);
              }
            },
            error: function(err) {
              dsettings.content = err.responseJSON.message;
              var d = Dialog(dsettings);
              d.show();
            },
            complete: function() {
              $submitBtn.prop('disabled', false);
            }
          });
        }
      });

      $('body')
        .on('touchend', '.btn-pingfen', function() {
          $('.overlay').show();
          $('.dialog-pingfen').addClass('show');
        })
        .on('touchend', '.overlay', function() {
          $(this).hide();
          $('.dialog-pingfen').removeClass('show');
        })
        .on('touchend', '.xrkm-text-more i', function() {
          var $btn = $(this);
          var $box = $(this).parent().prev('.case-des-content');
          if ($btn.hasClass('icon-xiangxia')) {
            $btn.attr('class', 'iconfont icon-xiangshang');
          } else {
            $btn.attr('class', 'iconfont icon-xiangxia');
          }
          $box.toggleClass('active');
        });

      $(document).on("click", "[data-ga]", function(e){
        var value = $(this).data("ga");
        if(typeof gaeventTracker == "undefined") return;
        switch(value){
          case 'lianxi4':
            gaeventTracker('电话咨询','点击数','电话咨询-点击数-bxr-fangan-detail-Top');
            break;
          case 'xiangxijiedu':
            gaeventTracker('微聊C端','点击数','微聊C端-点击数-bxr-fangan-detail-Buttom-免费微聊(开通微聊)')
            break;
        }
      });

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

      $('#share-list .list-content-title').e

      setTimeout(function(){
        seajs.use('http://assets.xrkcdn.com/global/script/analysis/xrk_ga.js');
      },300);
    });

  });