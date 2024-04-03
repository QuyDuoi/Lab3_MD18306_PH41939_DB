var express = require("express");
var router = express.Router();
const Distributors = require("../models/distributors");
const Fruits = require("../models/fruits");
const Upload = require("../config/common/upload");
const Users = require("../models/users");
const Transporter = require("../config/common/mail");
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC";
const Foods = require('../models/foods');

// API thêm food
router.post('/themMon', async (req, res) => {
    try {
        const data = req.body;
        const newFood = new Foods({
            tenMon: data.tenMon,
            loaiMon: data.loaiMon,
            giaMon: data.giaMon,
            trangThai: data.trangThai,
            hinhAnh: data.hinhAnh,
            moTa: data.moTa
        });
        const result = await newFood.save();
        if(result) {
            res.json({
                "status": 200,
                "messenger" : "Thêm món thành công",
                "data" : result
            })
        } else {
            res.json({
                "status" : 400,
                "messenger": "Thêm món thất bại",
                'data' : []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/add-distributor", async (req, res) => {
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    const payload = await new Promise((resolve, reject) => {
      JWT.verify(token, SECRETKEY, (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) reject(401);
        if (err) reject(403);
        resolve(_payload);
      });
    });

    console.log(payload);

    const data = await Fruits.find().populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
    if (error === 401) {
      return res.sendStatus(401);
    } else {
      return res.sendStatus(403);
    }
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

router.get("/get-list-fruit-have-name-a-or-x", async (req, res) => {
  try {
    const query = {
      $or: [{ name: { $regex: "A" } }, { name: { $regex: "X" } }],
    };

    const data = await Fruits.find(
      query,
      "name quantity price id_distributor"
    ).populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    const updatefruit = await Fruits.findById(id);
    let result = null;
    if (updatefruit) {
      (updatefruit.name = data.name ?? updatefruit.name),
        (updatefruit.quantity = data.quantity ?? updatefruit.quantity),
        (updatefruit.price = data.price ?? updatefruit.price),
        (updatefruit.status = data.status ?? updatefruit.status),
        (updatefruit.image = data.image ?? updatefruit.image),
        (updatefruit.description = data.description ?? updatefruit.description),
        (updatefruit.id_distributor =
          data.id_distributor ?? updatefruit.id_distributor),
        (result = await updatefruit.save());
    }

    if (result) {
      res.json({
        status: 200,
        messenger: "Cập nhật thành công",
        data: result,
      });
      console.log(result);
    } else {
      res.json({
        status: 200,
        messenger: "Lỗi. Cập nhật không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

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

router.post(
  "/add-fruit-with-file-image",
  Upload.array("image", 3),
  async (req, res) => {
    //Upload.array('image',5) => up nhiều tối đa là 5
    //Upload.single('image) => up load 1 file
    try {
      const data = req.body; //Lấy dữ liệu từ body
      const { files } = req; //Lấy files nếu upload nhiều, file nếu 1
      const urlsImage = files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
      const newfruit = new Fruits({
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
        image: urlsImage, //Thêm cả url hình
        description: data.description,
        id_distributor: data.id_distributor,
      });
      const result = (await newfruit.save()).populate("id_distributor");
      if (result) {
        res.json({
          status: 200,
          messenger: "Thêm thành công",
          data: result,
        });
      } else {
        res.json({
          status: 400,
          messenger: "Lỗi,thêm thất bại",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/register-send-email",
  Upload.single("avatar"),
  async (req, res) => {
    try {
      const data = req.body;

      const { file } = req;
      const newUser = Users({
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        //Uri avatar http://localhost:3000/uploads/filename
      });
      const result = await newUser.save();
      console.log(data);
      console.log(result);
      if (result) {
        //Gửi mail
        const mailOptions = {
          from: "quynsph41939@fpt.edu.vn",
          to: result.email, // Email nhận
          text: "Cảm ơn vì đã đến", // Nội dung email
        };
        //Nếu thêm thành công result !null trả về dữ liệu
        await Transporter.sendMail(mailOptions); // Gửi mail
        res.json({
          status: 200,
          messenger: "Đăng ký thành công",
          data: result,
        });
      } else {
        //Nếu thêm không thành công result null, thông báo không thành công
        res.json({
          status: 400,
          messenger: "Lỗi, đăng ký thất bại",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete('/reset-users', async (req, res) => {
  try {
      await Users.deleteMany({});
      res.json({ success: true, message: 'Dữ liệu đã được reset.' });
  } catch (error) {
      console.error('Lỗi khi reset dữ liệu:', error);
      res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi reset dữ liệu.' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });
    if (user) {
      //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
      //Khi token hết hạn,người dùng sẽ call 1 api khác để lấy token mới
      //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token,refreshToken mới
      //Nếu cả 2 token đều hết hạn người dùng sẽ phhair thoát app và đăng nhập lại
      const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
        expiresIn: "1d",
      });
      //expiresIn thời gian token
      res.json({
        status: 200,
        messenger: "Đăng nhập thành công",
        data: user,
        token: token,
        refreshToken: refreshToken,
      });
    } else {
      //Nếu thêm thành công result !null,thông báo không thành công
      res.json({
        status: 400,
        messenger: "Lỗi,đăng nhập không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/get-list-distributor', async (req, res) => {
  try {
      const data = await Distributors.find().sort({ createdAt: -1 });
      res.send(data);
  } catch (error) {
      console.log(error);
      res.status(500).json({
          status: 500,
          messenger: "Lỗi, thất bại",
          data: []
      });
  }
})


router.get('/search-distributor', async (req, res) => {
  try {
    const key = req.query.key;
    const data = await Distributors.find({name: {"$regex":key, "$options":"i"}})
    .sort({createdAt: -1});
    if (data) {
      res.send(data);
    } else {
      res.send(null);
    }
  } catch (error) {
    console.log(error);
    res.json({
      "status": 500,
      "messenger" : "Lỗi, thất bại",
      "data" : []
    })
  }
})

router.delete('/delete-distributor-by-id/:id', async (req,res) => {
  try {
    const {id} = req.params;
    const result = await Distributors.findByIdAndDelete(id);
    if (result) {
      res.json({
        "status": 200,
        "messenger" : "Xóa thành công",
        "data" : result
      })
    } else {
      res.json({
        "status": 400,
        "messenger" : "Xóa thất bại",
        "data" : []
      })
    }
  } catch (error) {
    console.log(error);
  }
})

router.put('/update-distributor-by-id/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    const result = await Distributors.findByIdAndUpdate(id, {name: data.name})
    if (result) {
      res.json({
        "status": 200,
        "messenger" : "Cập nhật thành công",
        "data" : result
      })
    } else {
      res.json({
        "status": 400,
        "messenger" : "Cập nhật thất bại",
        "data" : []
      })
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
