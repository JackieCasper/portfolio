$(() => {
  // set scroll event listener
  $(window).scroll(() => {
    // get scroll top
    const scrollTop = $(window).scrollTop();
    // handle all the scroll stuff
    headerHandler.name.scroll(scrollTop);
    headerHandler.nav.scroll(scrollTop);
    skillsHandler.scroll(scrollTop);
    workHandler.scroll(scrollTop);
  })

  // create a size handler that gets certain needed sizes when asked
  const sizeHandler = {
    vph: () => $(window).innerHeight(),
    vpw: () => $(window).innerWidth(),
    headerHeight: () => $('header').height()
  }

  // to handle header stuff
  const headerHandler = {
    // handle the header name stuff
    name: {
      $h1: $('h1'),
      finalSize: 1.7,
      startSize: 4,
      currentSize: 4,
      startMargin: 20,
      finalMargin: 10,
      currentMargin: 20,
      // on scroll
      scroll: function (scrollTop) {
        // if its still showing the header
        if (scrollTop < sizeHandler.headerHeight()) {
          // set the current size of the h1 based on how much the page is scrolled
          this.currentSize = (this.startSize - ((this.startSize - this.finalSize) / sizeHandler.headerHeight()) * scrollTop) || this.startSize;
          // set the margin based on how much the page has scrolled
          this.currentMargin = (this.startMargin - ((this.startMargin - this.finalMargin) / sizeHandler.headerHeight()) * scrollTop) || this.startMargin;

          // if its not still showing the header
        } else {
          // size and margin are the end size and margin
          this.currentSize = this.finalSize;
          this.currentMargin = this.finalMargin;
        }
        // set the css values
        this.$h1.css({
          fontSize: this.currentSize + 'em',
          margin: this.currentMargin + 'px auto'
        });
      }
    },
    // handle the nav stuff
    nav: {
      $nav: $('nav'),
      fixed: false,
      // on scroll
      scroll: function (scrollTop) {
        // if its not fixed and it should be
        if (scrollTop >= sizeHandler.headerHeight() && !this.fixed) {
          // fix it
          this.fixed = true;
          this.$nav.css('position', 'fixed');
          $('.skills-section').css('margin-top', this.$nav.height() + 30 + 'px');
          // if it is fixed and it shouldn't be
        } else if (scrollTop < sizeHandler.headerHeight() && this.fixed) {
          // unfix it
          this.fixed = false;
          this.$nav.css('position', 'static');
          $('.skills-section').css('margin-top', '0px');
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
    showing: [true, true, true],
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
          $($work).css('margin-' + side, -width - 40 + 'px');
          self.showing[i] = false;

          // if its out of the view the other way and showing
        } else if (scrollTop > bottom + 100 && self.showing[i]) {
          // set the css
          $($work).css('margin-' + side, -width - 40 + 'px');
          self.showing[i] = false;
        }
      })
    }
  }
})