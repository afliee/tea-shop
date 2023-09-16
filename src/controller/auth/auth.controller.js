class AuthController {
constructor({ authService }) {
    this.authService = authService;
  }

  async signUp(req, res) {
    const { body } = req;
    const signUp = await this.authService.signUp(body);

    res.status(201).send(signUp);
  }

  async signIn(req, res) {
    const { body } = req;
    const signIn = await this.authService.signIn(body);

    res.send(signIn);
  }
}