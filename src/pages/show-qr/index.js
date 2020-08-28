import * as encryption from "../../encryption.js"

async function setQRImageAndText(wcroute){
  const trackerID = encryption.generateSecureRandomString(10)
  const password = encryption.generateSecureRandomString(10)
  const qrData = globalThis.btoa(trackerID + ":" +  password)
  const qrImgStr = await QRCode.toDataURL(qrData, {errorCorrectionLevel: 'L'})
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
