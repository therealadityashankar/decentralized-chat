import Friend from "../../friend.js"

async function setQRImageAndText(wcroute){
  const user = window.userManager.currentUser
  const friend = await Friend.create()
  friend.initCommunication({user})
  console.log(friend)

  const jwk = await crypto.subtle.exportKey("jwk", friend.communicationKey)
  const qrDataRaw = JSON.stringify({trackerID:friend.trackerID, jwk})
  const qrData = globalThis.btoa(qrDataRaw)
  const qrImgStr = await QRCode.toDataURL(qrData)
  const chatInit = wcroute.querySelector(".chat-init")
  const img = chatInit.querySelector(".chat-init-qr")
  img.src = qrImgStr

  const input = chatInit.querySelector(".chat-init-str")
  input.value = qrData

  const inputCopyBtn = chatInit.querySelector(".chat-init-str-copy")
  inputCopyBtn.addEventListener("click", e => navigator.clipboard.writeText(input.value))

}

export async function load(wcroute){
  await setQRImageAndText(wcroute)
}
