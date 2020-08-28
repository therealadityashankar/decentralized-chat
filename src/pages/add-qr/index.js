import Friend from "../../friend.js"
let mediaStream;

export async function show(route){
  mediaStream = await navigator.mediaDevices.getUserMedia({video:true});
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
  const [dWidth, dHeight] = [vWidth*ratio, vHeight*ratio]
  const [mVert, mHori] = ([cWidth - dWidth, cHeight - dHeight])
                          .map(val => val/2)

  const draw = () => {
    ctx.drawImage(video, mVert, mHori, dWidth, dHeight)
    requestAnimationFrame(draw)
  }

  requestAnimationFrame(draw)
  handleJoining(route)
}

export async function hide(route){
  if(mediaStream) mediaStream.getTracks().forEach(track => track.stop())
}

const handleJoining = route => {
  const joinInp = route.querySelector(".p2-joining input[type='text']")
  const joinBtn = route.querySelector(".p2-joining input[type='button']")

  joinBtn.addEventListener('click', async e => {
    const details = window.atob(joinInp.value)
    const [trackerID, password] = details.split(":")
    const friend = await userManager
                         .currentUser
                         .createFriend({trackerID, password})

    friend.initCommunication()
    friend.addEventListener("initialized", e => {
      console.log("initialized")
      //wcrouter.route("/edit-friend/" + e.detail.friend.uuid)
    })
  })
}
