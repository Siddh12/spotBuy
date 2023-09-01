import nodemailer from 'nodemailer';
import { mongoose } from 'mongoose';
const { Schema } = mongoose;
import jwt from 'jsonwebtoken';


// connect mongoAtls (cloud)

mongoose.connect(
  "mongodb+srv://SiddhSpotBuy:SpotBuy@cluster0.fo0wwv7.mongodb.net/?retryWrites=true&w=majority",
  {useNewUrlParser:true})
  .then(()=>{
      console.log("Connected to MongoDB");
  })
  .catch(()=>{
      console.log("Couldn't connect to MongoDB");
  })

// connect mongoAtls (cloud) end 





// connect to localdatabase 



// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/spotBuy');
//   console.log("DataBase is connected");
// }

// main().catch(err => console.log(err));

// connect to local database 

const ProductSchema = new Schema({
  user_id: Number,
  category_id: Number,
  brand_id: Number,
  model_id: Number,
  trim_id: Number,
  fuelType: Number,
  modelYear: Number,
  country_id: Number,
  state_id: Number,
  city_id: Number,
  postStartDateTime: { type: Date, default: Date.now },
  postEndDateTime: { type: Date },
  title: String,
  Image: [String],
  description: String,
  price: Number,
  transmissionType: String,
  owner: Number,
  status: Boolean
});



const Product = mongoose.model('Product', ProductSchema)
// console.log(Product);


const userSchema = new Schema({
  otp: Number,
  name: String,
  username: String,
  mobile_No: Number,
  alternate_mobile: Number,
  datetime: { type: Date, default: Date.now },
  email: String,
  gender: String,
  age: Number,
  status: Boolean,
  image: [String],
  availablePost: Number,
  followers: [Number],
  following: [Number],
  address: { type: Object },
  token: String

});

const User = mongoose.model('User', userSchema)



const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'sid.singh9099@gmail.com',
    pass: 'kxzsqrmtzxlafsop'
  }
});



class UserController {

  //  whene user will be add new product

  static CreateNewProduct = async (req, res) => {
    const product = new Product(req.body);
    console.log(req.body);
    var databaseres = await product.save()
    console.log(databaseres);
    res.status(201).json(databaseres)
  }

  // For email verification email   

  static emailvarification = async function (req, res) {


    function otpfunction() {
      return Math.floor(100000 + Math.random() * 900000);
    }
    
    let otp = otpfunction()
    var databaseresponce
    var isEmailPresent = [];
    const checkuserexist = async function () {
      isEmailPresent = await User.find(req.body).exec();
      console.log(isEmailPresent.length);
      // res.status(200).send(isEmailPresent);
      if (isEmailPresent.length === 0) {
        console.log(true);

        createnewuser()
        sendEmail()
      } else {
        console.log(false);
        console.log(isEmailPresent);
        var alluser = async () => {
          const allProduct = await User.findByIdAndUpdate(isEmailPresent[0]._id, { $set: { otp: otp } })
          console.log(allProduct);
          databaseresponce = allProduct
        }
        sendEmail()
        alluser()
        setTimeout(() => {
          var alluser = async () => {
            const allProduct = await User.findByIdAndUpdate(isEmailPresent[0]._id, { $set: { otp: 111111 } })
            console.log(allProduct);
          }
          alluser()
        }, 300000);
      }
    }

    checkuserexist()





    let data = req.body;
    // console.log(data);
    data.otp = otp;
    // console.log(data);

    // console.log(req.body);



    var createnewuser = async () => {

      const user = new User(data);
      databaseresponce = await user.save()
      console.log(databaseresponce);
      console.log(databaseresponce._id);

      setTimeout(() => {
        var alluser = async () => {
          var id = "64e25834a5c5d1b44d66777a"
          const allProduct = await User.findByIdAndUpdate(databaseresponce._id, { $set: { otp: 111111 } })
          console.log(allProduct);
        }
        alluser()
      }, 300000);
    }

    // const user = new User(data);
    // var databaseresponce = await user.save()
    // console.log(databaseresponce);
    // console.log(databaseresponce._id);

    // setTimeout(() => {
    //   var alluser = async () => {
    //     var id = "64e25834a5c5d1b44d66777a"
    //     const allProduct = await User.findByIdAndUpdate(databaseresponce._id, { $set: { otp: 111111 } })
    //     console.log(allProduct);
    //   }
    //   alluser()
    // }, 300000);


    var sendEmail = async () => {
      const info = await transporter.sendMail({
        from: '"SpotBuy" <sid.singh9099@gmail.com>',
        to: data.email,
        subject: "Login OTP",
        text: "Hello",
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body>
              <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;      line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="https://spotrental.in/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SpotBuy</a>
                </div>
                <p style="font-size:1.1em">Hello There,</p>
                <p>Thank you for choosing SpotBuy. Use the following OTP to complete your Sign in procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                <p style="font-size:0.9em;">Regards,</p>
                <p style="font-size:0.5em;">SpotBuy</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>SpotBuy</p>
                  <p>Work From Home DevMode</p>
                  <p>INDIA</p>
                </div>
              </div>
            </div>
              </body>
            </html>
          `
      });

      var resval = {
        "otpinformation": info,
        "Databaseinformation": databaseresponce
      }
      res.status(200).send(resval);
      console.log("Message sent: %s", info.messageId);
      console.log(info);
    }


  }
  // for OTP varification 

  static otpVarification = async (req, res) => {
    console.log(req.body);
    const gototpdetails = await User.findById(req.body.id).exec();
    // console.log(gototpdetails);
    if (gototpdetails.otp === req.body.otp) {
      let token = jwt.sign({ email: gototpdetails.email }, 'AAAAAAAAAA')
      let databasevaluewithtoken = await User.findByIdAndUpdate(req.body.id, { $set: { token: token } })
      console.log(databasevaluewithtoken);
      res.status(202).json({
        "text": "OTP Verified Successfully",
        "token": token
      });
    } else {
      res.status(202).json({ "text": "OTP Verified UnSuccessfully" });
    }
  }


  // Update user Details 

  static updateUserDetails = async (req, res) => {
    console.log(req.body);
    var id = "64e2170b44b14e9521fccac3"
    const updatedUserDetail = await User.findByIdAndUpdate(req.body.id, { $set: req.body })
    res.status(202).json(updatedUserDetail)
  }




  // To get all product 


  static allProduct = async (req, res) => {
    const allProduct = await Product.find()
    res.status(202).json(allProduct)
  }




















  // working email fun start 

  // static email = async function (req, res) {

  //   const info = await transporter.sendMail({
  //       from: '"SpotBuy" <sid.singh9099@gmail.com>',
  //       to: "siddh.singh90@hotmail.com", 
  //       subject: "Login OTP", // Subject line
  //       text: "Hello", // plain text body
  //       html: `
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           <meta charset="utf-8">
  //         </head>
  //         <body>
  //         <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;  line-height:2">
  //         <div style="margin:50px auto;width:70%;padding:20px 0">
  //           <div style="border-bottom:1px solid #eee">
  //             <a href="https://spotrental.in/" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SpotBuy</a>
  //           </div>
  //           <p style="font-size:1.1em">Hi,</p>
  //           <p>Thank you for choosing SpotBuy. Use the following OTP to complete your Sign in procedures. OTP is valid for 5 minutes</p>
  //           <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">324457</h2>
  //           <p style="font-size:0.9em;">Regards,</p>
  //           <p style="font-size:0.5em;">SpotBuy</p>
  //           <hr style="border:none;border-top:1px solid #eee" />
  //           <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
  //             <p>SpotBuy</p>
  //             <p>Work From Home DevMode</p>
  //             <p>INDIA</p>
  //           </div>
  //         </div>
  //       </div>
  //         </body>
  //       </html>
  //     `
  //   });

  //   res.status(200).send("Message sent");
  //   console.log("Message sent: %s", info.messageId);
  //   console.log(info);
  // }




  // working email function end 
}



export default UserController









