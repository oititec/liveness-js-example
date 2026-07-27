(function () {
  function SoundFileUtilities(sdk) {
    this.sdk = sdk;
  }

  var SOUND_FILES_DIR =
    "/assets/js/facetec-v10/sample-app-resources/Vocal_Guidance_Audio_Files";

  SoundFileUtilities.prototype.setVocalGuidanceSoundFiles =
    function (currentCustomization) {
      currentCustomization.vocalGuidanceCustomization.pleaseFrameYourFaceInTheOvalSoundFile =
        SOUND_FILES_DIR +
        "/please_frame_your_face_sound_file.mp3";

      currentCustomization.vocalGuidanceCustomization.pleaseMoveCloserSoundFile =
        SOUND_FILES_DIR +
        "/please_move_closer_sound_file.mp3";

      currentCustomization.vocalGuidanceCustomization.pleaseRetrySoundFile =
        SOUND_FILES_DIR +
        "/please_retry_sound_file.mp3";

      currentCustomization.vocalGuidanceCustomization.uploadingSoundFile =
        SOUND_FILES_DIR +
        "/uploading_sound_file.mp3";

      currentCustomization.vocalGuidanceCustomization.facescanSuccessfulSoundFile =
        SOUND_FILES_DIR +
        "/facescan_successful_sound_file.mp3";

      currentCustomization.vocalGuidanceCustomization.pleasePressTheButtonToStartSoundFile =
        SOUND_FILES_DIR +
        "/please_press_button_sound_file.mp3";

      return currentCustomization;
    };

  window.SoundFileUtilitiesV10 = SoundFileUtilities;
})();