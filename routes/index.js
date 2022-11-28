var express = require('express');
const multer  = require('multer')
var router = express.Router();
const dates = require('date-and-time')
const nows  =  new Date();
const ngayTao = dates.format(nows,'DD/MM/YYYY HH:mm:ss');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:g72gaJGNtvrM1fSF@cluster0.tgixh4q.mongodb.net/').then((error)=>{
  if (error == null) console.log("Kết nối thành công");
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage,limits:{
    fileSize : 100 * 1024 * 1024, //2MB
  } }).single('avatar')

const ImageLoad = new mongoose.Schema({
  title: String,
  dateImage: String,
  mt: String,
  link: String
})

/* GET home page. */
router.get('/', function(req, res, next) {
  const img = mongoose.model('Image', ImageLoad);
  img.find({}).then(data => {
     res.render('index', { title: 'Express',data: data});
  })
});

router.post('/index', function(req, res, next) {
  const id = req.body.idImg;
  const img = mongoose.model('Image', ImageLoad);
  img.deleteOne({_id:''+id}).then(data => {
    if (data != null){
      img.find({}).then(data => {
        res.render('index', { title: 'Express',data: data});
      })
    }
  })
});

router.post('/AddImage', function (req, res) {
  res.render('AddImage',{notification: '', loadimage: ''});
})

router.post('/infoImg', function (req, res) {
  const datas = req.body.infoimg;
  const img = mongoose.model('Image', ImageLoad);
  img.find({_id:''+datas}).then(data => {
    res.render('LoadImg', {data: data});
  })
})

router.post('/uploadFile', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.render('AddImage', {notification: ' Đã xảy ra lỗi Multer khi tải lên.'})
    }else if (err) {
      res.render('AddImage', {notification: "Đã xảy ra lỗi không xác định khi tải lên."})
    }
    const timg = req.body.TitleImg;
    const mimg = req.body.MotaImg;
    const date = ngayTao;

    const link = req.file.path;

    const img = mongoose.model("Image",ImageLoad)
    const image = new img({
      title: timg,
      dateImage: date,
      mt: mimg,
      link: link
    })
    image.save().then(data =>{
      if (data != null){
        img.find({}).then(data => {
          res.render('index', { title: 'Express',data: data});
        })
      }else {
        res.render('AddImage', {notification: 'Upload that bai',loadimage: ''})
      }
    })
  })
})
router.post('/UpdateImage', function (req, res) {
  const id = req.body.idImg;
  const title = req.body.titleImg;
  const date = req.body.dateImg;
  const mt = req.body.motaImg;
  const link = req.body.linkImg;

  const img = mongoose.model('Image',ImageLoad);
  img.updateOne( {_id:''+id}, {
    title: title,
    dateImage: date,
    mt: mt,
    link: link
  }).then(data =>{
    if (data != null){
      img.find({}).then(data => {
        res.render('index', { title: 'Express',data: data});
      })
    }
  })
})
module.exports = router;
