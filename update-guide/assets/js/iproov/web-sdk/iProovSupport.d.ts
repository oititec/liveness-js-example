/**
 * Public type definitions for iProovSupport (copied to dist/ on prod build)
 */

export type iProovSupportCheck = {
  flags: {
    in_iframe: boolean
  }
  granted: boolean
  is_native_bridge: boolean
  supported: boolean
  tests: {
    browser: boolean
    frontCamera: boolean
    fullscreen: boolean
    gyro: boolean
    localStorage: boolean
    userMedia: boolean
    videoInput: boolean
    wasm: boolean
  }
}

type AssuranceTypes = "genuine_presence" | "liveness"

type iProovSupportCheckerEvents = "check" | "unsupported" | "granted" | "denied"

type iProovSupportOptions = {
  assurance_type: AssuranceTypes
}

declare class iProovSupport {
  // Optional console, could be a Console type or any as integrator can pass what they want, defaults to window.console
  constructor(console?: Console | any, options?: iProovSupportOptions)
  check(): Promise<iProovSupportCheck>
  checkWithPermission(): Promise<iProovSupportCheck>
  addEventListener(event: iProovSupportCheckerEvents, callback: (event: any) => void): void
}

export { iProovSupport }
