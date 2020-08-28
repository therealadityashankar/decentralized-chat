import * as encryption from "./encryption.js"

/**
 * a friend class to manage/communicate with other users
 *
 * you need to set the 'password' in storage for this to be really useful
 */
export default class Friend extends EventTarget{
  async init({storageName, storePrefix, uuid}){
    this.uuid = uuid
    this.storageName = storageName
    this.storePrefix = storePrefix
    this.storage = localforage.createInstance({name: storageName, 
                                               storeName: storePrefix + "-main"})
    this.p2pt = undefined
    return this
  }

  async getS(varName){
    return await this.storage.get(varName)
  }

  async setS(varName, value){
    return await this.storage.set(varName)
  }

  /**
   * @param {Object} info - unlike p2pt, this HAS TO BE an string, objects are not allowed
   */
  async send(info){
    if(!(typeof info === "string")) throw Error("chat: data send MUST be a string");
    this._sendType("external", {info})
  }

  /**
   * internally used function, send a specific type of operation
   * data is sent encrypted
   */
  async _sendType(type, info){
    const toSend = {type, data:info}
    const stringifyed = JSON.stringify(toSend)
    const encrypted = await this.encrypt(stringifyed)
    this.p2pt.send(this.peer, encrypted)
  }

  /**
   * encrypt a string, with the shared key
   *
   * @param {string} info
   * @returns {string} the encrypted data
   */
  async encrypt(info){
    return await encryption.encrypt(info, await this.getS('password'))
  }

  /**
   * decrypt a string, with the shared key
   *
   * @param {string} encInfo - the encrypted data
   * @returns {string} the decrypted data
   */
  async decrypt(encInfo){
    return await encryption.decrypt(encInfo, await this.getS('password'))
  }

  _getPeerOnConnect(){
    this.p2pt.on('peerconnect', peer => {
      this.peer = peer
      this.dispatchEvent(new CustomEvent('peer-retrieved'))
    })
  }

  _addMsgEventHandler(){
    this.p2pt.on('msg', async (peer, msg) => {
      const decryptedMessage = await this.decrypt(msg)
      const parsed = JSON.parse(decryptedMessage)

      if(parsed.type === "external"){
        const event = {detail: {msg:parsed.data}}
        this.dispatchEvent(new CustomEvent("msg", event))

      } else if(parsed.type === "init-detail-change"){
        this.name = parsed.data.details.name 
      }
    })
  }
}
