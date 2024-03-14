var express = require("express");
var router = express.Router();
const Distributors = require("../models/distributors");
const Fruits = require("../models/fruits");

router.post("/add_distributor", async (req, res) => {
  try {
    const data = req.body;
    const newDistributors = new Distributors({
      name: data.name,
    });
    const result = await newDistributors.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, thêm không thành công!",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/add_fruit", async (req, res) => {
  try {
    const data = req.body;
    const newFruit = new Fruits({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      image: data.image,
      description: data.description,
      id_distributor: data.id_distributor,
    });
    const result = await newFruit.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      res.json({
        status: 404,
        messenger: "Lỗi, thêm không thành công!",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-list-fruit", async (req, res) => {
  try {
    const data = await Fruits.find().populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Lấy danh sách thành công",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-list-fruit-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fruits.findById(id).populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Lấy danh sách ID thành công",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/update_fruit_id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateFruit = await Fruits.findById(id);
    let result = null;
    if (updateFruit) {
      (updateFruit.name = data.name ?? updateFruit.name),
        (updateFruit.quantity = data.quantity ?? updateFruit.quantity),
        (updateFruit.price = data.price ?? updateFruit.price),
        (updateFruit.status = data.status ?? updateFruit.status),
        (updateFruit.image = data.image ?? updateFruit.image),
        (updateFruit.description = data.description ?? updateFruit.description),
        (updateFruit.id_distributor =
          data.id_distributor ?? updateFruit.id_distributor),
        (result = await updateFruit.save());
    }

    if (result) {
      res.json({
        status: 200,
        messenger: "Cập nhật thành công",
        data: result,
      });
    } else {
      res.json({
        status: 404,
        messenger: "Lỗi, cập nhật không thành công!",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-list-fruit-in-price", async (req, res) => {
  try {
    const { price_start, price_end } = req.query;

    const query = { price: { $gte: price_start, $lte: price_end } };
    const data = await Fruits.find(query, "name quantity price id_distributor")
      .populate("id_distributor")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(2);
    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
  try {
      const query = {$or: [
          {name: {$regex: 'A'}},
          {name: {$regex: 'X'}},
      ]}

      const data = await Fruits.find(query, 'name quantity price id_distributor')
          .populate('id_distributor')
      res.json({
          "status": 200,
          "messenger": "Danh sách fruit",
          "data": data
      })
  } catch (error) {
      console.log(error);
  }
});

router.put('/update-fruit-by-id/:id', async (req, res) => {
  try {
      const {id} = req.params;
      const data = req.body;
      const updatefruit = await Fruits.findById(id)
      let result = null;
      if(updatefruit){
          updatefruit.name = data.name ?? updatefruit.name,
          updatefruit.quantity = data.quantity ?? updatefruit.quantity,
          updatefruit.price = data.price ?? updatefruit.price,
          updatefruit.status = data.status ?? updatefruit.status,
          updatefruit.image = data.image ?? updatefruit.image,
          updatefruit.description = data.description ?? updatefruit.description,
          updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor,
          result = await updatefruit.save();
      }

      if(result){
          res.json({
              "status": 200,
              "messenger": "Cập nhật thành công",
              "data": result
          })
      }else {
          res.json({
              "status": 200,
              "messenger": "Lỗi. Cập nhật không thành công",
              "data": []
          })
      }
  } catch (error) {
      console.log(error);
  }
})

router.delete("/delete-fruit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFruit = await Fruits.findByIdAndDelete(id);

    if (!deletedFruit) {
      return res.status(404).json({
        status: 404,
        message: "Không tìm thấy mục hàng với ID đã cho.",
      });
    }

    res.json({
      status: 200,
      message: "Xóa mục hàng thành công.",
      data: deletedFruit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Đã xảy ra lỗi trong quá trình xóa mục hàng.",
    });
  }
});

module.exports = router;
