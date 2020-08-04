import DEFAULT_IMAGE from "./defaultUserImage.js"

/**
 * the default user class
 */
export default class User{
  constructor(name){
    this.name = name
    this.friends = {}
    this.image = DEFAULT_IMAGE
  }

  /**
   * initialize a User from an object
   */
  static initFromJSON(){
    // todo
  }

  /**
   * add a new "Friend" object (see "./friend.js")
   *
   * note: this will throw an error if a friend with the name already exists
   *
   * @param {Friend} friend - a friend object (see "./friend.js")
   */
  addFriend(friend){
    if(friend.name in this.friends){
      throw Error("chatErr: a friend with this name already exists")
    }
    this.friends[friend.name] = friend
  }
}
