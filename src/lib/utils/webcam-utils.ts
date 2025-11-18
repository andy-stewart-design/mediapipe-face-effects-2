async function getWebcamStream(
  device?: MediaDeviceInfo,
  width = 960,
  height = 720
) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: device ? { exact: device.deviceId } : undefined,
          width,
          height,
        },
      });
      return stream;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    console.warn("getUserMedia is not supported in this browser.");
    return null;
  }
}

async function getDevices() {
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      return videoDevices;
    } catch (err) {
      console.error("Error enumerating devices:", err);
      return null;
    }
  } else {
    console.warn("enumerateDevices is not supported in this browser.");
    return null;
  }
}

export { getWebcamStream, getDevices };
