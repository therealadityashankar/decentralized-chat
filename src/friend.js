import random from "https://ghcdn.rawgit.org/therealadityashankar/imageolive/v0.1.0/random.js";

/**
 * a friend class to manage/communicate with other users
 */
export default class Friend{
  constructor(){
    this.trackerID=""
    this.name=""
    this.communicationKey=""
    this.p2pt = undefined
  }

  /**
   * add a friend
   */
  static async create(opts={}){
    const friend = new Friend()

    friend.trackerID = opts.trackerID||this._generateRandomID()
    friend.name = opts.name
    friend.communicationKey = opts.communicationKey
    if(!friend.communicationKey) await friend.setNewRandomSharedKey()
    return friend
  }

  /**
   * set a new randomized shared key
   */
  async setNewRandomSharedKey(){
    const algo = {name: "AES-GCM", length:256}
    this.communicationKey = await window
                                    .crypto
                                    .subtle
                                    .generateKey(algo, true, ["encrypt", "decrypt"])
  }

  static _generateRandomID(){
    let trackerID = ""
    let usableCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"

    for(var i=0; i<32; i++){
      const num = random.randint(0, usableCharacters.length - 1)
      trackerID += usableCharacters[num]
    }

    return trackerID
  }

  /**
   * initiate communication
   *
   * @param {User} user - User object from "./user.js", this friend object will automatically be added to the user upon a successful connection
   * @param {function} [connectionCallback] - this callback will be called upon successfully connecting with the user
   */
  initCommunication({user, connectionCallback=null}){
    const trackersAnnounceURLs = [
      "wss://tracker.openwebtorrent.com",
      "wss://tracker.sloppyta.co:443/announce",
      "wss://tracker.novage.com.ua:443/announce",
      "wss://tracker.btorrent.xyz:443/announce",
    ]

    this.p2pt = new P2PT(trackersAnnounceURLs, this.trackerID)

    this.p2pt.on('trackerconnect', (tracker, stats) => {
      console.log('Connected to tracker : ' + tracker.announceUrl)
      console.log('Tracker stats : ' + JSON.stringify(stats))
    })

    this.p2pt.on('peerconnect', peer => {
      this.p2pt.send(peer, "Hi!")

      user.addFriend(this);
      if(connectionCallback) connectionCallback(this)
    })

    this.p2pt.on('msg', (peer, msg) => {
      console.log("recieved :", msg)
    })


    this.p2pt.start()
  }
}
