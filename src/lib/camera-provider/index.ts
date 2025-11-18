import { getWebcamStream, getDevices } from "../utils/webcam-utils";
import type GUI from "lil-gui";
import type { Controller } from "lil-gui";

interface CameraProviderOptions {
  video: HTMLVideoElement;
  devices: MediaDeviceInfo[] | null;
  gui: GUI;
  width?: number;
  height?: number;
}

const CONTROLS = { device: "default" };

export class CameraProvider {
  readonly video: HTMLVideoElement;
  private readonly controller: Controller;

  static async init(
    video: HTMLVideoElement,
    gui: GUI,
    width?: number,
    height?: number
  ) {
    const devices = await getDevices();
    return new CameraProvider({ video, gui, devices, width, height });
  }

  constructor({ video, gui, devices, width, height }: CameraProviderOptions) {
    this.video = video;

    this.controller = gui.add(CONTROLS, "device", {});
    this.controller.onChange((device: MediaDeviceInfo) =>
      this.setupWebcam(device, width, height)
    );

    if (devices) {
      const opts = Object.fromEntries(devices.map((d) => [d.label, d]));
      this.controller.options(opts);
      this.controller.setValue(devices[0].label);
      this.controller.updateDisplay();
    }

    this.setupWebcam(devices?.[0], width, height);
  }

  private async setupWebcam(
    device?: MediaDeviceInfo,
    width?: number,
    height?: number
  ) {
    const play = () => this.video.paused && this.video.play();
    const stream = await getWebcamStream(device, width, height);
    this.video.addEventListener("loadedmetadata", play);
    this.video.srcObject = stream;
  }
}
