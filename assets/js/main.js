if (!window.miq) { window.miq = {
  ui: {}
}; }

miq.select = function(selector) {
  if (selector == null) { selector = "body"; }
  return document.querySelector(selector);
};

miq.selectAll = function(selector) {
  if (selector == null) { selector = "body"; }
  return document.querySelectorAll(selector);
};

// Header animation

miq.setup_header_ani = function() {
  miq.header = miq.select(".site-header");
  miq.triad  = miq.select(".triad");
  miq.title  = miq.select(".banner h1");

  miq.fade_offset = miq.header.offsetHeight;
  miq.fade_start  = miq.fade_offset / 2; // Start fading a little lower than top
  miq.fade_stop   = (miq.triad.offsetTop + miq.triad.offsetHeight);
  miq.fade_diff   = (miq.fade_stop - miq.fade_start) / 1.8;

  miq.header_pad  = parseInt($(miq.header).css('padding-top'));
  miq.scale_start = miq.header.offsetHeight;
  miq.scale_stop  = miq.fade_stop;
  miq.scale_diff  = (miq.scale_stop - miq.fade_start) * 1.1;

  miq.last_scroll_y = -1;
};

miq.fade_header = function() {
  let opac;
  if ((miq.last_scroll_y > miq.fade_start) && (miq.last_scroll_y < miq.fade_stop)) {
    opac = miq.last_scroll_y / miq.fade_diff;
  } else if (miq.last_scroll_y < miq.fade_start) {
    opac = 0;
  } else if (miq.last_scroll_y > miq.fade_stop) {
    opac = 1;
  }

  const start_values = [6, 52, 81, opac];
  const end_values   = [12, 105, 165, opac];

  const start_color = `rgba(${start_values.join()})`;
  const end_color   = `rgba(${end_values.join()})`;

  miq.header.style.backgroundImage = `linear-gradient(to right, ${start_color} 0, ${end_color} 100%)`;
};

miq.scale_header = function() {
  // shrink padding by half

  let divider;
  if ((miq.last_scroll_y > miq.scale_start) && (miq.last_scroll_y < miq.scale_stop)) {
    divider = 1 + (miq.last_scroll_y / miq.scale_diff);
  } else if (miq.last_scroll_y < miq.scale_start) {
    divider = 1;
  } else if (miq.last_scroll_y > miq.scale_stop) {
    divider = 2;
  }

  const pad = miq.header_pad / divider;

  miq.header.style.paddingTop = `${pad}px`;
  miq.header.style.paddingBottom = `${pad}px`;
};

miq.on_scroll = () => miq.update_background();

miq.update_background = function() {
  if (miq.last_scroll_y === window.scrollY) {
    requestAnimationFrame(miq.update_background);
    return false;
  } else {
    miq.last_scroll_y = window.scrollY;
  }

  miq.animate_header();
  requestAnimationFrame(miq.update_background);
};

miq.animate_header = function() {
  miq.fade_header();
  miq.scale_header();
};


$(document).ready(function() {
  if ($(".triad").length > 0) {
    miq.setup_header_ani();
    miq.scale_header();
    window.addEventListener("scroll", miq.on_scroll);
  }
});

$(document).ready(() => $('[data-behavior="off_canvas-toggle"]').on('click', () => $('body').toggleClass('off_canvas-visible')));

// Menu

// Open all down to active link
miq.open_active = () => $("li.active").parents("li").each((i, elem) => $(elem).addClass("menu-open"));

$(document).ready(function() {
  if ($(".menu-parent").length > 0) {
    miq.open_active();

    $(document).on("click", ".menu-parent > a", function(e) {
      $(this).parent("li.menu-parent").toggleClass("menu-open");
      e.preventDefault();
    });
  }
});

// A super simple image zoom solution inspired by Dribbble

miq.LightboxImg = class LightboxImg {
  constructor(elem) {
    this.element = $(elem);
    this.bindEvents();
  }

  bindEvents() {
    this.element.on('click', function() {
      miq.lightbox.display(this.src, this.alt);
    });
  }
};

miq.Lightbox = class Lightbox {
  constructor(boxDiv) {
    this.bindEvents = this.bindEvents.bind(this);
    this.box = $(boxDiv);

    this.title = this.box.find('.lightbox-title');
    this.titleText = "Enlarged Image";

    this.closeBtn = this.box.find('.lightbox-close');
    this.image = this.box.find('.lightbox-image > img');

    this.bindEvents();
  }

  display(imgSrc, text) {
    if (text == null) { text = ''; }
    this.image.attr('src', imgSrc);

    if (text.length > 0) {
      this.title.text(text);
    }

    // set body to no-scroll
    $('body').addClass('js-no_scroll');

    // reset zoom
    $('.lightbox-image').removeClass('lightbox-full');

    // set class of container
    this.box.addClass('js-display');
  }

  close() {
    this.box.removeClass('js-display');
    $('body').removeClass('js-no_scroll');
  }

  bindEvents() {
    this.closeBtn.on('click', () => {
      this.close();
    });

    this.box.on('click', e => {
      this.close();
    });

    this.image.on('click', function(e) {
      e.stopPropagation();
      $('.lightbox-image').toggleClass('lightbox-full');
    });
  }
};

$(document).ready(function() {
  miq.boxImgs = [];
  for (var elem of $('.large_img')) { miq.boxImgs.push(new miq.LightboxImg(elem)); }

  miq.lightbox = new miq.Lightbox('#lightbox');
});

miq.light_theme     = "light-theme";
miq.dark_theme      = "dark-theme";
miq.storage_key     = "miq-theme";
miq.button_selector = "[data-toggle-theme]";
miq.html_doc        = miq.select("html");
miq.theme_buttons   = miq.selectAll(miq.button_selector);

miq.set_theme = function(was, now) {
  miq.html_doc.classList.add(now);
  miq.html_doc.classList.remove(was);
  localStorage.setItem(miq.storage_key, JSON.stringify(now));
};

miq.handle_button_click = function() {
  // get the current theme from localStorage
  const current_theme = localStorage.getItem(miq.storage_key);

  // If the current theme and its light theme then set it to dark theme else if
  // its dark then set it to light
  if (current_theme) {
    if (JSON.parse(current_theme) === miq.light_theme) {
      miq.set_theme(miq.light_theme, miq.dark_theme);
    } else {
      miq.set_theme(miq.dark_theme, miq.light_theme);
    }

  } else {
    // if localStorage is not defined then we want to use whatever the media
    // color-scheme is to switch it to the opposite
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      miq.set_theme(miq.dark_theme, miq.light_theme);
    } else {
      miq.set_theme(miq.light_theme, miq.dark_theme);
    }
  }
};

for (var button of miq.theme_buttons) {
  button.addEventListener("click", miq.handle_button_click);
}

