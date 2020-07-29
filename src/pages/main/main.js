async function setQRImageAndText(wcroute){
  console.log(wcroute.innerHTML)
  const qrImgStr = await QRCode.toDataURL("some-string")
  const chatInit = wcroute.querySelector(".chat-init")
  const img = document.createElement("img")
  img.src = qrImgStr
  chatInit.appendChild(img)
  const p = document.createElement('p')
  p.classList.add("chat-init-str")
  p.innerText = "something string abc a sjhkncjksdsmkl  skamk"
  chatInit.appendChild(p)
}

export async function load(wcroute){
  await setQRImageAndText(wcroute)
}
