import Friend from "./friend.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'


/**
 * the default user class
 */
export default class User{
  /**
   * access a user from their localforage storage
   * if one doesn't exist they'll be created
   *
   * @param storage.name - the localforage instances name
   * @param storage.storePrefix - the localforage instances storage prefix, all relevent data to the user will be stored with a table with this store prefix
   */
  constructor({uuid, storageName, storePrefix}){
    this.uuid = uuid
    this.storageName = storageName
    this.storePrefix = storePrefix
    this.storage = localforage.createInstance({name:storageName, storeName:storePrefix + "-main"})
  }

  /**
   * get a stored variable
   * stored variables are direct variables accessed from localforage over
   * caching it locally
   *
   * @param {string} variableName - a stored variable you want
   */
  async getS(variableName){
    if(variableName === "friends") return this.__getFriends()
    return await this.storage.getItem(variableName)
  }

  /**
   * get a stored variable
   * stored variables are direct variables accessed from localforag
   *
   * @param {string} variableName - a stored variable you want
   * @param {string} variableValue - the value you want to set to the stored variable
   */
  async setS(variableName, variableValue){
    if(variablename === "friends") return this.__setFriends(variableValue)
    return await this.storage.setItem(variableName, variableValue)
  }

  async __getFriends(){
    const friends = await this.storage.getItem('friends')
    const keys = Object.keys(friends)

    if(friends === null) return {}

    for(const key of keys){
      friends[key] = new Friend(key, friends[key])
    }

    return friends
  }

  async __setFriends(friends){
    const uuids = Object.keys(friends)
    const serialized = {}

    for(const uuid of uuids){
      serialized[uuid] = friends[uuid].unsafeStorageSerialize()
    }

    return await this.storage.setItem('friends', serialized)
  }

  /**
   * create a new "Friend" object, and add it to storage (see "./friend.js")
   *
   * note: this will throw an error if a friend with the same uuid already exists
   *
   * @returns {Friend} - a Friend from "./friend.js" object
   */
  async newFriend(){
    const storageName = this.storageName
    const uuid = uuidv4()
    const storePrefix = this.storePrefix + "-friend-" + uuid
    const friends = await this.getS('friends')
    const friend = await (new Friend.init({storageName, storePrefix, uuid}))

    if(friend.uuid in friends){
      throw Error("chatErr: a friend with this uuid already exists")
    }

    friends[friend.uuid] = friend
    await this.setS('friends', friends)
    return friend
  }

  /**
   * get basic safe information, stuff you can tell
   * a newly met friend
   */
  get basicSafeInfo(){
    return {
      name: this.name,
      image: this.image
    }
  }
}
