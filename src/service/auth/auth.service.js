import {env} from "#root/config/index.js";

function signIn() {

}

function signUp(user) {
    console.log("signUp", user);
    return user;
}



export default {
    signIn,
    signUp
}