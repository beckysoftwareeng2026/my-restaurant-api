function validateMenu(req, res, next) {
    const { name, description, price, category, available } = req.body;

    if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        available === undefined
    ) {
        return res.status(400).json({
            message:
                "Name, description, price, category, and availability are required.",
        });
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            message: "Name must be a non-empty string.",
        });
    }

    if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({
            message: "Description must be a non-empty string.",
        });
    }

    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({
            message: "Price must be a non-negative number.",
        });
    }

    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({
            message: "Category must be a non-empty string.",
        });
    }

    if (typeof available !== "boolean") {
        return res.status(400).json({
            message: "Available must be true or false.",
        });
    }

    next();
}

module.exports = validateMenu;