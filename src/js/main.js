$('.header-search-wrapper .search-main').click(function () {
  $('.search-form-main').toggleClass('active-search');
  $('.search-form-main .search-field').focus();
});
// navbar
$(function () {
  var $ul = $('.sidebar-navigation > ul');

  $ul.find('li a').click(function (e) {
    var $li = $(this).parent();

    if ($li.find('ul').length > 0) {
      e.preventDefault();

      if ($li.hasClass('selected')) {
        $li.removeClass('selected').find('li').removeClass('selected');
        $li.find('ul').slideUp(400);
        $li.find('a em').removeClass('mdi-flip-v');
      } else {

        if ($li.parents('li.selected').length == 0) {
          $ul.find('li').removeClass('selected');
          $ul.find('ul').slideUp(400);
          $ul.find('li a em').removeClass('mdi-flip-v');
        } else {
          $li.parent().find('li').removeClass('selected');
          $li.parent().find('> li ul').slideUp(400);
          $li.parent().find('> li a em').removeClass('mdi-flip-v');
        }

        $li.addClass('selected');
        $li.find('>ul').slideDown(400);
        $li.find('>a>em').addClass('mdi-flip-v');
      }
    }
  });


  $('.sidebar-navigation > ul ul').each(function (i) {
    if ($(this).find('>li>ul').length > 0) {
      var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
      var pIntPLeft = parseInt(paddingLeft);
      var result = pIntPLeft + 20;

      $(this).find('>li>a').css('padding-left', result);
    } else {
      var paddingLeft = $(this).parent().parent().find('>li>a').css('padding-left');
      var pIntPLeft = parseInt(paddingLeft);
      var result = pIntPLeft + 20;

      $(this).find('>li>a').css('padding-left', result).parent().addClass('selected--last');
    }
  });

  var t = ' li > ul ';
  for (var i = 1; i <= 10; i++) {
    $('.sidebar-navigation > ul > ' + t.repeat(i)).addClass('subMenuColor' + i);
  }

  var activeLi = $('li.selected');
  if (activeLi.length) {
    opener(activeLi);
  }

  function opener(li) {
    var ul = li.closest('ul');
    if (ul.length) {

      li.addClass('selected');
      ul.addClass('open');
      li.find('>a>em').addClass('mdi-flip-v');

      if (ul.closest('li').length) {
        opener(ul.closest('li'));
      } else {
        return false;
      }

    }
  }

});
// navbar end
// Back to top
var amountScrolled = 200;
var amountScrolledNav = 25;

$(window).scroll(function () {
  if ($(window).scrollTop() > amountScrolled) {
    $('button.back-to-top').addClass('show');
  } else {
    $('button.back-to-top').removeClass('show');
  }
});

$('button.back-to-top').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 800);
  return false;
});
// back to top end

// slider single news img
// Primary slider.
var primarySlider = new Splide('#primary_slider', {
  type: 'fade',
  heightRatio: 0.5,
  pagination: false,
  arrows: false,
  cover: true,
});

// Thumbnails slider.
var thumbnailSlider = new Splide('#thumbnail_slider', {
  rewind: true,
  fixedWidth: 100,
  fixedHeight: 64,
  isNavigation: true,
  gap: 10,
  focus: 'center',
  pagination: false,
  cover: true,
  breakpoints: {
      '600': {
          fixedWidth: 66,
          fixedHeight: 40,
      }
  }
}).mount();

// sync the thumbnails slider as a target of primary slider.
primarySlider.sync(thumbnailSlider).mount();
