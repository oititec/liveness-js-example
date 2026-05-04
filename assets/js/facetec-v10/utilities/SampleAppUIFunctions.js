(function () {
  function SampleAppUIFunctions(elementString) {
    this.currentElements =
      document.querySelectorAll(elementString);
  }

  SampleAppUIFunctions.prototype.saveDisplayForElement =
    function (el) {
      var display = window.getComputedStyle(el).display;

      if (display && display !== "none") {
        el.setAttribute("displaytype", display);
      }
    };

  SampleAppUIFunctions.prototype.setDisplayForElement =
    function (el) {
      var display = "block";

      var saved = el.getAttribute("displaytype");
      if (saved !== null) {
        display = saved;
      }

      el.style.display = display;
    };

  SampleAppUIFunctions.prototype._fadeIn = function (
    el,
    opacity,
    duration,
    callback
  ) {
    if (!el) return;

    opacity = opacity || "1";
    duration = duration || 300;

    var computed = window.getComputedStyle(el);

    if (
      computed.display === "none" &&
      computed.opacity === "1"
    ) {
      el.style.opacity = "0";
    }

    el.style.visibility = "visible";
    this.saveDisplayForElement(el);
    this.setDisplayForElement(el);

    el.style.transition = "opacity " + duration + "ms";

    setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity;
      });
    });

    var self = this;

    setTimeout(function () {
      self.setDisplayForElement(el);
      if (callback) callback();
    }, duration);
  };

  SampleAppUIFunctions.prototype._fadeOut = function (
    el,
    opacity,
    duration,
    callback
  ) {
    if (!el) return;

    opacity = opacity || "0";
    duration = duration || 300;

    this.saveDisplayForElement(el);

    el.style.transition = "opacity " + duration + "ms";

    setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity;
      });
    });

    setTimeout(function () {
      el.style.display = "none";
      if (callback) callback();
    }, duration);
  };

  SampleAppUIFunctions.prototype.fadeOut = function (
    duration,
    callback
  ) {
    for (var i = 0; i < this.currentElements.length; i++) {
      this._fadeOut(
        this.currentElements[i],
        "0",
        duration,
        callback
      );
    }
  };

  SampleAppUIFunctions.prototype.fadeIn = function (
    duration,
    callback
  ) {
    for (var i = 0; i < this.currentElements.length; i++) {
      this._fadeIn(
        this.currentElements[i],
        "1",
        duration,
        callback
      );
    }
  };

  SampleAppUIFunctions.prototype.show = function () {
    for (var i = 0; i < this.currentElements.length; i++) {
      var el = this.currentElements[i];
      el.style.opacity = "1";
      this.setDisplayForElement(el);
    }
  };

  SampleAppUIFunctions.prototype.hide = function () {
    for (var i = 0; i < this.currentElements.length; i++) {
      var el = this.currentElements[i];
      el.style.opacity = "0";
      el.style.visibility = "visible";
      this.saveDisplayForElement(el);
      this.setDisplayForElement(el);
    }
  };

  SampleAppUIFunctions.prototype.scrollTop = function (
    value
  ) {
    for (var i = 0; i < this.currentElements.length; i++) {
      this.currentElements[i].scrollTop = value;
    }
  };

  SampleAppUIFunctions.prototype.css = function (styles) {
    if (typeof styles !== "object") {
      throw new Error(
        "UI.css must be called with an object"
      );
    }

    for (var i = 0; i < this.currentElements.length; i++) {
      var el = this.currentElements[i];

      for (var key in styles) {
        if (styles.hasOwnProperty(key)) {
          el.style[key] = styles[key];
        }
      }
    }
  };

  window.SampleAppUIFunctions = SampleAppUIFunctions;
})();