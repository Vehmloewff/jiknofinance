import { registerPlugin } from '@capacitor/core'
import type { CameraPlugin } from '@capacitor/camera/dist/esm/definitions'

export const Camera = registerPlugin('Camera') as CameraPlugin

export * from '@capacitor/camera/dist/esm/definitions'
