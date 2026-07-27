const express = require("express");
const menuRouter = require("./routes/menu");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to My Restaurant API!");
});

app.use("/menu", menuRouter);
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});