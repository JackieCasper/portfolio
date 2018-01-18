$(() => {


  const scroll = ()=>{
    // get scroll top
    const scrollTop = $(window).scrollTop();
    // handle all the scroll stuff
    headerHandler.name.scroll(scrollTop);
    headerHandler.nav.scroll(scrollTop);
    skillsHandler.scroll(scrollTop);
    workHandler.scroll(scrollTop);
  }

  // set scroll event listener
  $(window).scroll(() => {
    scroll();
  })

  $('.nav-button').click(() => {
    $('nav.mobile').toggleClass('open');
  });

  $(window).resize(() => {
    $(window).scroll();
  })

  // copy email when email contact button is pressed
  $('#email').click((e)=>{
    $('#email-select').select();
    document.execCommand('copy');
    $('.notification').height(46)
      .animate({top: "46px"})
      .delay(1500)
      .animate({top:"0px"})
      .promise()
      .done(()=> $('.notification').height(0));
  })

  // smooth link scrolling
  $('.nav-group a').click((e)=>{
    e.preventDefault();
    const location = $($(e.target).attr('href')).offset().top;
    $('#email-select').select();
    $('html, body').animate({
      scrollTop: location - 25
    }, 1000);
  })

  // create a size handler that gets certain needed sizes when asked
  const sizeHandler = {
    vph: () => $(window).innerHeight(),
    vpw: () => $(window).innerWidth(),
    headerHeight: () => $('header').height(),
    breakPoint: function () {
      return this.vpw() < 790 ? true : false;
    }
  }

  // to handle header stuff
  const headerHandler = {
    // handle the header name stuff
    name: {
      $h1: $('h1'),
      finalSize: 1.7,
      startSize: 4,
      currentSize: 4,
      startTop: 20,
      finalTop: 5,
      currentTop: 20,
      // on scroll
      scroll: function (scrollTop) {
        if (sizeHandler.breakPoint()) {
          this.startSize = 3;
          this.finalTop = 10;
          this.startTop = 120;

        } else {
          this.startSize = 4;
          this.finalTop = 5;
          this.startTop = 20;
        }
        // if its still showing the header
        if (scrollTop < sizeHandler.headerHeight()) {

          // set the current size of the h1 based on how much the page is scrolled
          this.currentSize = (this.startSize - ((this.startSize - this.finalSize) / sizeHandler.headerHeight()) * scrollTop) || this.startSize;
          this.currentTop = (this.startTop - ((this.startTop - this.finalTop) / sizeHandler.headerHeight()) * scrollTop);
          // if its not still showing the header
        } else {
          // size and margin are the end size and margin
          this.currentSize = this.finalSize;
          this.currentTop = this.finalTop;
        }
        // set the css values
        this.$h1.css({
          fontSize: this.currentSize + 'em',
          top: this.currentTop + 'px'
        });
      }
    },
    // handle the nav stuff
    nav: {
      $nav: $('nav.desktop'),
      groups: [
        {
          $group: $('.nav-group').first(),
          startOffset: function () {
            return ($('nav.desktop').width() / 2) - this.$group.width() - 15;
          },
          side: 'left',
          endOffset: function(){
            return $('nav.desktop').width() < 1200 ? 0 : (($('nav.desktop').width() - 1200)/ 2) - 20
          }
        },
        {
          $group: $('.nav-group').last(),
          startOffset: function () {
            return ($('nav.desktop').width() / 2) - this.$group.width() - 15;
          },
          side: 'right',
          endOffset: function(){
            return ($('nav.desktop').width() < 1200 ? 0 : (($('nav.desktop').width() - 1200)/ 2) - 20)
          }
        }
      ],
      fixed: false,
      // on scroll
      scroll: function (scrollTop) {

        // if its not fixed and it should be
        if (scrollTop >= sizeHandler.headerHeight() - 10 && !this.fixed) {
          // fix it
          this.fixed = true;
          this.$nav.css({
            position: 'fixed',
            top: '0'
          });
          // stops bouncing on mobile
          $(window).scrollTop(scrollTop + 5);
          // if it is fixed and it shouldn't be
        } else if (scrollTop < sizeHandler.headerHeight() - 10 && this.fixed) {
          // unfix it
          this.fixed = false;
          this.$nav.css({
            position: 'absolute',
            top: 'auto'
          });

        }
        if (scrollTop < sizeHandler.headerHeight() - 10) {
          this.groups.forEach(function (group) {
            const currentOffset = group.startOffset() - ((group.startOffset() - group.endOffset()) * (scrollTop / sizeHandler.headerHeight()));
            group.$group.css(group.side, currentOffset + 'px');
          });
        } else {
          this.groups.forEach(function (group) {
            group.$group.css(group.side, group.endOffset());
          })
        }
      }
    }
  }

  // handle skills stuff
  const skillsHandler = {
    $skillImgs: $('.skill-section>img'),
    // on scroll
    scroll: function (scrollTop) {
      const self = this;
      // for each skill
      this.$skillImgs.each(function (i, $skill) {
        // get top and bottom
        const top = $($skill).parent().offset().top;
        const bottom = top + $($skill).parent().height();
        // if the skill is on the page
        if (scrollTop + (sizeHandler.vph() / 2) > top && !$($skill).hasClass('flipped') && !(scrollTop > bottom)) {
          // flip it
          $($skill).addClass('flipped');
          // if the skill is below the view line
        } else if (scrollTop + (sizeHandler.vph() / 2) <= top && $($skill).hasClass('flipped')) {
          // flip it back
          $($skill).removeClass('flipped');
          // if its above the view line
        } else if (scrollTop > bottom + 100 && $($skill).hasClass('flipped')) {
          // flip it back
          $($skill).removeClass('flipped');
        }
      })
    }
  }

  // work work work work work
  const workHandler = {
    $workContents: $('.work-content'),
    showing: [true, true, true, true, true],
    // on scroll
    scroll: function (scrollTop) {
      const self = this;
      // for each of the work contents
      this.$workContents.each(function (i, $work) {
        // default side is left
        let side = 'left';
        // get width, top, and bottom
        const width = $($work).width();
        const top = $($work).parent().offset().top;
        const bottom = top + $($work).parent().height();
        // if it is even
        if (i % 2 !== 0) {
          // its on the right
          side = 'right';
        }
        // if its within the view and not showing
        if (scrollTop + (sizeHandler.vph() / 2) > top && !self.showing[i] && !(scrollTop > bottom + 100)) {
          // set the css
          $($work).css('margin-' + side, 0);
          self.showing[i] = true;

          // if its out of the view and showing
        } else if (scrollTop + (sizeHandler.vph() / 2) <= top && self.showing[i]) {
          // set the css
          $($work).css('margin-' + side, -width - 80 + 'px');
          self.showing[i] = false;

          // if its out of the view the other way and showing
        } else if (scrollTop > bottom + 100 && self.showing[i]) {
          // set the css
          $($work).css('margin-' + side, -width - 80 + 'px');
          self.showing[i] = false;
        }
      })
    }
  }

  scroll();

})
