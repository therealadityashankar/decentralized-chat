/**
* this code is Public Domain,
*
* be careful where you use encryption/decryption and if you need it at all, most frameworks will handle this for you by themselves,
* while there are use cases from encryption and decryption, check if you REALLY need to do it on the client side.
*
* use cases include - Password managers that only want to store encrypted passwords without ever receiving the password as plaintext,
*                     or decentralized text messaging systems, where the communication is initiated manually
*
* use cases DON'T include - manually setting up an additional encryption beyond HTTPS/as an alternate to HTTPS, making a custom
*                           encryption protocol for your user
*
* if you're a newbie, and fairly new to javascript/practical javascript, no you should not be using this, we've all fallen in that trap
* before
*/
export async function encrypt(text, password){
  const data = new TextEncoder().encode(text)
  const iv = window.crypto.getRandomValues(new Uint8Array(16))
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const algo = {name: "AES-GCM", length: 256, iv}
  const deriveKeyParams = { name : "PBKDF2", salt, iterations: 10000, hash: "SHA-256" }
  const key = await deriveKey(deriveKeyParams, algo, password)
  const result = await crypto.subtle.encrypt(algo, key, data) // this result is an arraybuffer, now you can represent it as a string with something like
  const resultString = String.fromCharCode(...new Uint8Array(result))
  const ivString = String.fromCharCode(...iv)
  const saltString = String.fromCharCode(...salt) // one way of representing the output data is
  return btoa(saltString) + "." + btoa(ivString) + "." + resultString
}

export async function decrypt(encText, password){
  const [saltStringB64, ivStringB64] = encText.split(".", 2)
  const [saltString, ivString] = [saltStringB64, ivStringB64].map(s => atob(s))
  const encString = encText.substring(saltStringB64.length + ivStringB64.length + 2)
  const enc = Uint8Array.from(encString, x => x.charCodeAt(0))
  const iv = Uint8Array.from(ivString, x => x.charCodeAt(0))
  const salt = Uint8Array.from(saltString, x => x.charCodeAt(0))
  const deriveKeyParams = { name : "PBKDF2", salt, iterations: 10000, hash: "SHA-256" }
  const algo = {name: "AES-GCM", length: 256, iv}
  const key = await deriveKey(deriveKeyParams, algo, password)
  const result = await crypto.subtle.decrypt(algo, key, enc)
  return new TextDecoder().decode(result)
}

async function deriveKey(keyParams, algo, password){
  const keyMaterial = await (window
                              .crypto
                              .subtle
                              .importKey("raw",
                                         new TextEncoder().encode(password),
                                         "PBKDF2", false, ["deriveKey"]))
  return await (window.crypto.subtle.deriveKey(keyParams, keyMaterial, algo, false, ["encrypt", "decrypt"]))
}

export function generateSecureRandomString(numChars){
  let trackerID = ""
  let usableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*()"

  for(var i=0; i<numChars; i++){
    const randomNum = crypto.getRandomValues(new Uint32Array(1))[0]
    const scaled0to1 = randomNum/4294967295
    const num = Math.floor(scaled0to1*usableCharacters.length)
    trackerID += usableCharacters[num]
  }

  return trackerID
}

