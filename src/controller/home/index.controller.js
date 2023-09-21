class IndexController {
    constructor() {
        this.name = 'index';
    }

    async index(req, res) {
        res.render("home/index.ejs", {
            title: "Home",
            active: "home"
        });
    }

    async product(req, res) {
        res.render("home/product.ejs", {
            title: "Product",
        });
    }
}

export default new IndexController();