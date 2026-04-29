(function () {
  var VocalGuidanceMode = {
    MINIMAL: 0,
    FULL: 1,
    OFF: 2,
  };

  function SampleAppUtilities() {}

  SampleAppUtilities.vocalGuidanceSoundFilesDirectory =
    "/assets/js/facetec-v10/sample-app-resources/Vocal_Guidance_Audio_Files/";
    

  SampleAppUtilities.vocalGuidanceOnPlayer = new Audio(
    SampleAppUtilities.vocalGuidanceSoundFilesDirectory +
      "vocal_guidance_on.mp3"
  );

  SampleAppUtilities.vocalGuidanceOffPlayer = new Audio(
    SampleAppUtilities.vocalGuidanceSoundFilesDirectory +
      "vocal_guidance_off.mp3"
  );

  SampleAppUtilities.vocalGuidanceMode =
    VocalGuidanceMode.MINIMAL;

  // ===== INIT UI =====
  SampleAppUtilities.setupAndFadeInMainUIOnInitializationSuccess =
    function () {
      this.setupVocalGuidancePlayers();
      this.fadeInMainUIContainer();
      this.enableControlButtons();

      if (this.isLikelyMobileDevice()) {
        this.fadeInVocalIconContainer();
      }
    };

  SampleAppUtilities.setupVocalGuidancePlayers = function () {
    var self = this;

    this.vocalGuidanceOnPlayer.volume = 0.4;
    this.vocalGuidanceOffPlayer.volume = 0.4;

    this.vocalGuidanceOnPlayer.onended = function () {
      self.enableVocalGuidanceButtons();
    };

    this.vocalGuidanceOffPlayer.onended = function () {
      self.enableVocalGuidanceButtons();
    };
  };

  SampleAppUtilities.setVocalGuidanceMode = function () {
    this.disableVocalGuidanceButtons();

    if (
      !this.vocalGuidanceOnPlayer.paused ||
      !this.vocalGuidanceOffPlayer.paused
    ) {
      return;
    }

    var playPromise;

    switch (this.vocalGuidanceMode) {
      case VocalGuidanceMode.OFF:
        this.vocalGuidanceMode = VocalGuidanceMode.MINIMAL;

        toggleDisplay("vocal-guidance-icon-minimal", true);
        toggleDisplay("vocal-guidance-icon-full", false);
        toggleDisplay("vocal-guidance-icon-off", false);

        playPromise = this.vocalGuidanceOnPlayer.play();

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.MINIMAL;
        break;

      case VocalGuidanceMode.MINIMAL:
        this.vocalGuidanceMode = VocalGuidanceMode.FULL;

        toggleDisplay("vocal-guidance-icon-minimal", false);
        toggleDisplay("vocal-guidance-icon-full", true);
        toggleDisplay("vocal-guidance-icon-off", false);

        playPromise = this.vocalGuidanceOnPlayer.play();

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.FULL;
        break;

      case VocalGuidanceMode.FULL:
        this.vocalGuidanceMode = VocalGuidanceMode.OFF;

        toggleDisplay("vocal-guidance-icon-minimal", false);
        toggleDisplay("vocal-guidance-icon-full", false);
        toggleDisplay("vocal-guidance-icon-off", true);

        playPromise = this.vocalGuidanceOffPlayer.play();

        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.OFF;
        break;
    }

    if (playPromise) {
      playPromise.catch(function () {});
    }

    FaceTecSDK.setCustomization(Config.currentCustomization);
  };

  SampleAppUtilities.setVocalGuidanceSoundFiles = function () {
    var soundFileUtilities = new SoundFileUtilities();

    Config.currentCustomization =
      soundFileUtilities.setVocalGuidanceSoundFiles(
        Config.currentCustomization
      );

    FaceTecSDK.setCustomization(Config.currentCustomization);
  };

  SampleAppUtilities.fadeInMainUIContainer = function () {
    new SampleAppUIFunctions("#theme-transition-overlay").fadeOut(800);
    new SampleAppUIFunctions(".wrapping-box-container").fadeIn(800);
    new SampleAppUIFunctions("footer").fadeIn(800);
  };

  SampleAppUtilities.fadeInMainUIControls = function (callback) {
    if (this.isLikelyMobileDevice()) {
      new SampleAppUIFunctions("#custom-logo-container").fadeIn(800);
      new SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
    }

    new SampleAppUIFunctions("footer").fadeIn(800);

    new SampleAppUIFunctions("#controls").fadeIn(800, function () {
      SampleAppUtilities.enableVocalGuidanceButtons();

      if (callback) callback();
    });
  };

  SampleAppUtilities.fadeInVocalIconContainer = function () {
    new SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
  };

  SampleAppUtilities.fadeOutMainUIAndPrepareForSession =
    function () {
      this.disableControlButtons();

      if (this.isLikelyMobileDevice()) {
        new SampleAppUIFunctions("#custom-logo-container").fadeOut(800);
        new SampleAppUIFunctions("#vocal-icon-container").fadeOut(800);
        this.disableVocalGuidanceButtons();
      }

      new SampleAppUIFunctions("footer").fadeOut(800);
      new SampleAppUIFunctions("#controls").fadeOut(800);
      new SampleAppUIFunctions(".wrapping-box-container").fadeOut(800);
      new SampleAppUIFunctions("#theme-transition-overlay").fadeIn(800);
    };

  SampleAppUtilities.enableControlButtons = function () {
    document
      .querySelectorAll("#controls > button")
      .forEach(function (btn) {
        btn.removeAttribute("disabled");
      });

    this.enableVocalGuidanceButtons();
  };

  SampleAppUtilities.disableControlButtons = function () {
    document
      .querySelectorAll("#controls > button")
      .forEach(function (btn) {
        btn.setAttribute("disabled", "true");
      });
  };

  SampleAppUtilities.showMainUI = function () {
    this.fadeInMainUIContainer();
    this.fadeInMainUIControls();
  };

  SampleAppUtilities.formatUIForDevice = function () {
    var self = this;

    window.addEventListener("keydown", function (e) {
      self.onKeyDown(e);
    });

    this.displayElementsAfterStyling();
  };

  SampleAppUtilities.displayElementsAfterStyling = function () {
    document.querySelectorAll("button").forEach(function (btn) {
      btn.classList.add("button-transitions");
    });

    new SampleAppUIFunctions("body").fadeIn(800);
  };

  SampleAppUtilities.onKeyDown = function (e) {
    if (e.key === "Tab") {
      this.enableKeyboardAccessibilityStyling(true);
    }
  };

  SampleAppUtilities.enableKeyboardAccessibilityStyling =
    function (enable) {
      if (this.isLikelyMobileDevice()) return;

      document.querySelectorAll(".ft-button").forEach(function (el) {
        el.style.outline = enable ? "revert" : "none";
      });
    };

  SampleAppUtilities.isLikelyMobileDevice = function () {
    var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(
      navigator.userAgent || ""
    );

    if (
      isMobile &&
      (navigator.userAgent.includes("CrOS") ||
        navigator.userAgent.includes("Chromebook"))
    ) {
      isMobile = false;
    }

    return screen.width < screen.height || isMobile;
  };

  SampleAppUtilities.disableVocalGuidanceButtons = function () {
    document
      .querySelectorAll(".vocal-icon")
      .forEach(function (btn) {
        btn.setAttribute("disabled", "true");
      });
  };

  SampleAppUtilities.enableVocalGuidanceButtons = function () {
    document
      .querySelectorAll(".vocal-icon")
      .forEach(function (btn) {
        btn.removeAttribute("disabled");
      });
  };

  function toggleDisplay(id, show) {
    var el = document.getElementById(id);
    if (el) el.style.display = show ? "block" : "none";
  }

  window.SampleAppUtilities = SampleAppUtilities;
})();