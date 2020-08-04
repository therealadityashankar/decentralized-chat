import User from "./user.js"

/**
 * a class to manage users data via localstorage
 */
export default class UserManager{
  constructor(){
    this.users = {}
    this.currentUser = undefined;
  }

  get count(){
    return Object.keys(this.users).length
  }

  /**
   * add a user
   *
   * @param {User} user - see "./user.js" for the user class
   */
  add(user){
    this.users[user.name] = user
  }

  /**
   * get the user from its name
   *
   * @param {string} name
   * @returns {User}
   */
  get(name){
    return this.users[name]
  }

  /**
   * set the current user
   *
   * @param {User} user - see "./user.js" for the user class
   */
  setCurrentUser(user){
    this.currentUser = user
  }

  /**
   * creates a default user if needed, i.e. there are no users
   */
  createDefaultUser(){
    if(this.count === 0){
      const user = new User("Unnamed user")
      this.add(user)
      this.setCurrentUser(user)
    }
  }
}
