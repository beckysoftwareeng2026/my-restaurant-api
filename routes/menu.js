const express = require("express");
const menuItems = require("../data/menu");
const validateMenu = require("../middleware/validateMenu");

const router = express.Router();

router.get("/", (req, res) => {
    const { category, available, page = 1, limit = 10 } = req.query;

    let filteredMenu = [...menuItems];

    if (category) {
        filteredMenu = filteredMenu.filter(
            (item) => item.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (available !== undefined) {
        if (available !== "true" && available !== "false") {
            return res.status(400).json({
                message: "Available must be true or false.",
            });
        }

        const isAvailable = available === "true";

        filteredMenu = filteredMenu.filter(
            (item) => item.available === isAvailable
        );
    }

    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);

    if (
        Number.isNaN(pageNumber) ||
        Number.isNaN(limitNumber) ||
        pageNumber < 1 ||
        limitNumber < 1
    ) {
        return res.status(400).json({
            message: "Page and limit must be positive whole numbers.",
        });
    }

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const paginatedMenu = filteredMenu.slice(startIndex, endIndex);

    res.status(200).json({
        totalItems: filteredMenu.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(filteredMenu.length / limitNumber),
        pageSize: paginatedMenu.length,
        items: paginatedMenu,
    });
});

router.get("/:id", (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Menu item ID must be a number.",
        });
    }

    const menuItem = menuItems.find((item) => item.id === id);

    if (!menuItem) {
        return res.status(404).json({
            message: "Menu item not found",
        });
    }

    res.status(200).json(menuItem);
});

router.post("/", validateMenu, (req, res) => {
    const { name, description, price, category, available } = req.body;

    const newMenuItem = {
        id:
            menuItems.length > 0
                ? Math.max(...menuItems.map((item) => item.id)) + 1
                : 1,
        name: name.trim(),
        description: description.trim(),
        price,
        category: category.trim().toLowerCase(),
        available,
    };

    menuItems.push(newMenuItem);

    res.status(201).json(newMenuItem);
});

router.put("/:id", validateMenu, (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Menu item ID must be a number.",
        });
    }

    const menuItem = menuItems.find((item) => item.id === id);

    if (!menuItem) {
        return res.status(404).json({
            message: "Menu item not found",
        });
    }

    const { name, description, price, category, available } = req.body;

    menuItem.name = name.trim();
    menuItem.description = description.trim();
    menuItem.price = price;
    menuItem.category = category.trim().toLowerCase();
    menuItem.available = available;

    res.status(200).json(menuItem);
});

router.delete("/:id", (req, res) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Menu item ID must be a number.",
        });
    }

    const index = menuItems.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Menu item not found",
        });
    }

    const deletedItem = menuItems.splice(index, 1);

    res.status(200).json({
        message: "Menu item deleted successfully",
        deletedItem: deletedItem[0],
    });
});

module.exports = router;
