/**
 * Public type definitions (released with bundled NPM package)
 */

// required to declare global
export {}

// option type values
export type CANVAS_FILTER = "classic" | "clear" | "shaded" | "vibrant" | "blur"
export type ARIA_LIVE = "assertive" | "polite" | "off"

// support React JSX templates
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["iproov-me"]: {
        allow_landscape?: boolean
        aria_live?: ARIA_LIVE
        assets_url?: string
        base_url?: string
        children?: any // not a valid option, supports React child components
        csp_nonce?: string
        close_button?: string
        custom_title?: string | null
        debug?: boolean
        enable_camera_selector?: boolean
        filter?: CANVAS_FILTER
        key?: any // not a valid option, supports React integrations
        kiosk_mode?: boolean
        language?: string
        logo?: string
        native_sdk_options?: string
        network_timeout?: number
        token: string
        new_ufc?: boolean
        prompt_rounded_corners?: boolean
      }
    }
  }
}
