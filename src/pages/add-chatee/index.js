export async function load(route){
  const mediaStream = await navigator.mediaDevices.getUserMedia({video:true});
  const video = document.createElement("video")
  video.srcObject = mediaStream 
  await new Promise(res => video.addEventListener("loadedmetadata", res));
  video.play()
  const cameraCanvas = route.querySelector(".camera-screen")
  const ctx = cameraCanvas.getContext("2d")

  const [cWidth, cHeight] = [cameraCanvas.width, cameraCanvas.height]
  const [vWidth, vHeight] = [video.videoWidth, video.videoHeight]
  const [rWidth, rHeight] = [cWidth/vWidth, cHeight/vHeight]
  const ratio = Math.min(rWidth, rHeight)
  cameraCanvas.width = vWidth*ratio
  cameraCanvas.height = vHeight*ratio

  const draw = () => {
    ctx.drawImage(video, 0, 0, cameraCanvas.width, cameraCanvas.height)
    requestAnimationFrame(draw)
  }

  requestAnimationFrame(draw)
}
