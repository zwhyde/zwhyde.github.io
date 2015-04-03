seajs.use(['http://cdn.bootcss.com/jquery.touchswipe/1.6.4/jquery.touchSwipe.js', 'fastclick'],
  function (_x) {

    $(document).on('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $(function () {
      FastClick.attach(document.body);

      $('.overlay,.mod-nav-windows').on('touchstart', function (e) {
        if ($('.nav-window.active').length) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      $(".page").swipe({
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
          if (direction == 'up') {
            $('.mod-nav-windows').addClass('show transition');
            $('.overlay').show();
          }

          if (direction == 'down') {
            $('.mod-nav-windows').removeClass('show');
            $('.overlay').hide();
          }
        }
//            threshold:0
      });

      $('.mod-nav-windows .nav-window').on('click', function (e) {
        e.stopPropagation();
        $('.nav-window.active').removeClass('active');
        $(this).addClass('active').parent().addClass('active');
      });
      $('.modal-del').on('click', function (e) {
        e.stopPropagation();
        var w = $(this).parents('.nav-window');
        w.removeClass('active').one('webkitTransitionEnd', function () {
          $(this).parent().removeClass('active')
        });
      });


      $('#pingfen1 :submit').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.modal-bd').toggleClass('active');
      })

     /* //弹框
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
      });*/



    });

  });