import User from "./user.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/**
 * a class to manage users data via localstorage
 */
export default class UserManager extends EventTarget{
  /**
   * @param {string} opts.storageName - this name will be used for creating a localstorage instance
   * @param {string} [opts.storePrefix=""] - all usermanager related data will be prefixed with this
   */
  constructor({storageName, storePrefix=""}){
    super()
    this.storageName = storageName
    this.storePrefix = storePrefix
    this.storage = localforage.createInstance({name:storageName, storeName: (storePrefix + "main")})
  }

  async getS(varName){
    return await this.storage.getItem(varName)
  }

  async setS(varName, value){
    return await this.storage.setItem(varName, value)
  }
  
  /**
   * add a user, and returns the added user, this user IS added to storage
   * @returns {User} - see "./user.js" for the User class
   */
  async addUser(){
    const uuid = uuidv4()
    const storageName = this.storageName
    const storePrefix = this.storePrefix + "user-" + uuid
    const user = new User({storageName, storePrefix, uuid});
    const userUUIDs = (await this.getS('user-uuids'))||[]

    userUUIDs.push(user.uuid)
    await this.setS("user-uuids", userUUIDs)

    return user
  }


  /**
   * set the current user
   * emits an event 'currentUserChange'
   *
   * @param {User} user - see "./user.js" for the user class
   */
  async setCurrentUser(user){
    await this.storage.setItem("current-user-uuid", user.uuid)

    const event = {
      detail : {
        currentUser: user,
        manager: this
      }
    }

    this.dispatchEvent(new CustomEvent('currentUserChange', event))
  }

  getUser(uuid){
    const storageName = this.storageName
    const storePrefix = this.storePrefix + "user-" + uuid
    return new User({storageName, storePrefix, uuid})
  }

  async getCurrentUser(){
    const currentUserUUID = await this.storage.getItem("current-user-uuid")

    if(currentUserUUID === null) return

    return this.getUser(currentUserUUID)
  }

  /**
   * creates a default user if needed, i.e. there are no users
   * sets the last user that was here before the window was closed if there
   * is are existing users
   */
  async createDefaultUserIfNeeded(){
    const users = await this.getS("user-uuids")||{}
    const userCount = Object.keys(users).length
    if(userCount === 0){
      await this.setCurrentUser(await this.addUser())
    }
  }
}
