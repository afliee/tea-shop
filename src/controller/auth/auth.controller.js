import {validationResult} from "express-validator";

import {AuthService} from "#services/index.js";

class AuthController {
    constructor() {
    }

    signUp(req, res) {
        const errorAfterValidation = validationResult(req);
        if (!errorAfterValidation.isEmpty()) {
            return res.status(400).send({errors: errorAfterValidation.mapped()});
        }
        // this.authService undefined
        const {body} = req;
        const signUp = AuthService.signUp(body);

        res.status(201).send(signUp);
    }

    async signIn(req, res) {
        const {body} = req;
        const signIn = await AuthService.signIn(body);

        res.send(signIn);
    }
}

export default new AuthController();