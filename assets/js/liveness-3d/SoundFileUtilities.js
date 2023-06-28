// Load custom sound files
let FACESCAN_SOUND_FILE =
  '/assets/sample-app-resources/Vocal_Guidance_Audio_Files';

var SoundFileUtilities = /** @class */ (function () {
  function SoundFileUtilities() {
    // Return the customization object updated with custom sound files
    this.setVocalGuidanceSoundFiles = function (zoomCustomization) {
      zoomCustomization.vocalGuidanceCustomization.pleaseFrameYourFaceInTheOvalSoundFile = `${FACESCAN_SOUND_FILE}/please_frame_your_face_sound_file.mp3`;
      zoomCustomization.vocalGuidanceCustomization.pleaseMoveCloserSoundFile = `${FACESCAN_SOUND_FILE}/please_move_closer_sound_file.mp3`;
      zoomCustomization.vocalGuidanceCustomization.pleaseRetrySoundFile = `${FACESCAN_SOUND_FILE}/please_retry_sound_file.mp3`;
      zoomCustomization.vocalGuidanceCustomization.uploadingSoundFile = `${FACESCAN_SOUND_FILE}/uploading_sound_file.mp3`;
      zoomCustomization.vocalGuidanceCustomization.facescanSuccessfulSoundFile = `${FACESCAN_SOUND_FILE}/facescan_successful_sound_file.mp3`;
      zoomCustomization.vocalGuidanceCustomization.pleasePressTheButtonToStartSoundFile = `${FACESCAN_SOUND_FILE}/please_press_button_sound_file.mp3`;
      return zoomCustomization;
    };
  }
  return SoundFileUtilities;
})();
var SoundFileUtilities = SoundFileUtilities;
