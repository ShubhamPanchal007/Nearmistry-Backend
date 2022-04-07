import { User } from "../models/items_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ****************************###############################################*************************************#########################
// #########################################################################################################################################

//****FETCHING NEW ITEMS****
export const getHomePage = async (req, res) => {
  const { page } = req.query;
  const { labour } = req.query;
  const { painter } = req.query;
  const { helper } = req.query;
  const { raj_mistri } = req.query;
  const { welder } = req.query;
  const { tileGraniteWorkers } = req.query;
  const { occupation } = req.query;
  const { lat } = req.query;
  const { lng } = req.query;
  try {
    const LIMIT = 9;
    const itemsToSkip = (Number(page) - 1) * LIMIT;
    // ###################################################################GEOJSO ##################################################

    /*
        $near "sorts" the results to return, and that is always going to take more time than not sorting. So it depends on what you want. If "order" of "nearest" is important, then you use $near. If it is not, then use $geoWithin and a plain definition of a circle. Which is the only polygon the two share in common.
        */
    // const total = await User.countDocuments({
    //   $and: [
    //     {
    //       occupation: {
    //         $in: [
    //           `${labour}`,
    //           `${painter}`,
    //           `${helper}`,
    //           `${raj_mistri}`,
    //           `${welder}`,
    //           `${tileGraniteWorkers},`,
    //           `${occupation}`,
    //         ],
    //       },
    //     },
    // {
    //   location: {
    //     $geoWithin: {
    //       $centerSphere: [[`${lat}`, `${lng}`], 4.3496],
    //       //   quering documents that lies within the 4.3496 miles or 7.4 km radius with respect to the user's location i.e (lat,lng)
    //     },
    //   },
    // },
    //   ],
    // });
    // ###################################################################GEOJSON ^^^^^^^^^^^^^^^^

    // ###################################################################GEOJSON #########################################

    // const items = await User.find({
    //   occupation: {
    //     $and: [
    //       {
    //         occupation: {
    //           $in: [
    //             `${labour}`,
    //             `${painter}`,
    //             `${helper}`,
    //             `${raj_mistri}`,
    //             `${welder}`,
    //             `${tileGraniteWorkers},`,
    //             `${occupation}`,
    //           ],
    //         },
    //       },
    // {
    //   location: {
    //     $geoWithin: {
    //       /*FUN FACT: LONGITUDE COMES FIRST IN A GEOJSON COORDINATE ARRAY SCHEMA NOT LATITUDE :)*/
    //       $centerSphere: [[`${lng}`, `${lat}`], 4.3496],
    //       //   quering documents that lies within the 4.3496 miles or 7.4 km radius with respect to the user's location i.e (lat,lng)
    //     },
    //   },
    // },
    //     ],
    //   },
    // })
    // ###################################################################GEOJSON #########################################
    const total = await User.countDocuments({
      occupation: {
        $in: [
          `${labour}`,
          `${painter}`,
          `${helper}`,
          `${raj_mistri}`,
          `${welder}`,
          `${tileGraniteWorkers},`,
          `${occupation}`,
        ],
      },
    });
    const items = await User.find({
      occupation: {
        $in: [
          `${labour}`,
          `${painter}`,
          `${helper}`,
          `${raj_mistri}`,
          `${welder}`,
          `${tileGraniteWorkers}`,
          `${occupation}`,
        ],
      },
    })
      .limit(LIMIT)
      .skip(itemsToSkip);
    res.json({
      data: items,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (e) {
    console.log(e.message);
  }
};

// ****************************###############################################*************************************########################
// ########################################################################################################################################
// ********\/\/\/\/\/\/\/*********GETTING -----> [occupation:"Labour",numberOfPages:Math.ceil(total/LIMIT)]

export const getInfo = async (_, res) => {
  try {
    const LIMIT = 9;
    const totalLabour = await User.countDocuments({
      occupation: { $in: ["Labour"] },
    });
    const totalTileGraniteWorker = await User.countDocuments({
      occupation: { $in: ["Tile Granite worker"] },
    });
    const totalRaj_mistry = await User.countDocuments({
      occupation: { $in: ["Raj Mistry"] },
    });
    const totalElectrician = await User.countDocuments({
      occupation: { $in: ["Electrician"] },
    });
    const totalMaid = await User.countDocuments({
      occupation: { $in: ["Maid"] },
    });
    const totalPlumber = await User.countDocuments({
      occupation: { $in: ["Plumber"] },
    });
    const totalWelder = await User.countDocuments({
      occupation: { $in: ["Welder"] },
    });
    const totalCarpenter = await User.countDocuments({
      occupation: { $in: ["Carpenter"] },
    });
    const totalPainter = await User.countDocuments({
      occupation: { $in: ["Painter"] },
    });
    res.json([
      { occupation: "Labour", numberOfPages: Math.ceil(totalLabour / LIMIT) },
      {
        occupation: "Raj Mistry",
        numberOfPages: Math.ceil(totalRaj_mistry / LIMIT),
      },
      {
        occupation: "Tile Granite worker",
        numberOfPages: Math.ceil(totalTileGraniteWorker / LIMIT),
      },
      {
        occupation: "Electrician",
        numberOfPages: Math.ceil(totalElectrician / LIMIT),
      },
      {
        occupation: "Maid",
        numberOfPages: Math.ceil(totalMaid / LIMIT),
      },
      {
        occupation: "Plumber",
        numberOfPages: Math.ceil(totalPlumber / LIMIT),
      },
      {
        occupation: "Welder",
        numberOfPages: Math.ceil(totalWelder / LIMIT),
      },
      {
        occupation: "Carpenter",
        numberOfPages: Math.ceil(totalCarpenter / LIMIT),
      },
      {
        occupation: "Painter",
        numberOfPages: Math.ceil(totalPainter / LIMIT),
      },
    ]);
  } catch (e) {
    console.log(e.message);
  }
};

// ****************************###############################################*************************************########################
// ########################################################################################################################################
dotenv.config({ path: "../.env" });
//****POSTING NEW ITEMS****
export const postNewUser = async (req, res) => {
  try {
    const {
      fName,
      lName,
      age,
      gender,
      phoneNumber,
      imgUrl,
      occupation,
      areaName,
      location,
    } = req.body;
    //  If there is any field that's not filled show this alert box.
    //  if(!lName|!age|!gender|!phoneNumber|!imgUrl|!occupation|!areaName|!location){
    //      return res.status(400).json({message:"Please fill the required credentials!!"})
    //  }
    const phoneNum = await User.findOne({ phoneNumber: phoneNumber });

    if (phoneNum) {
      return res.status(400).json({ message: "Phone number already in use!" });
    }
    // if(!imgUrl){
    //   return res.status(401).json({message:"Please try upload your image"})
    // }
    // if(!areaName){
    //   return res.status(401).json({message:"Fill address again"})
    // }
    /*NOW WE'LL USE CLOUDINARY OR PLATFORMS LIKE S3 FOR IMAGE STORAGE AND WILL NOT USE BASE64 FOR ENCODING OF OUR IMAGE TO SAVE INTO OUR DATABASE */
    //         //Save new user in our database
    const newUser = new User({
      fName,
      lName,
      age,
      gender,
      phoneNumber,
      imgUrl,
      occupation,
      areaName,
      location,
    });

    await newUser.save();
    return res.status(201).json({
      message: "Registration succsessful",
    });

    //     }
    //     ).catch(error => {
    //         // error handeling
    //         res.send(error)
    //     })
  } catch (e) {
    console.log(e);
  }
};

/*FUN FACT: LONGITUDE COMES FIRST IN A GEOJSON COORDINATE ARRAY SCHEMA NOT LATITUDE.  

{ */

// ****************************###############################################*************************************########################
// #############################****LIST NEW BUSINESS****###############################################################
import { Businesses } from "../models/business_model.js";
export const listNewBusiness = async(req, res) => {
  try {
    const {
      bName,
      bAge,
      phoneNumber,
      bType,
      imgUrl,
      ownerImg,
      areaName,
      location,
    } = req.body;
    const newBusiness = new Businesses({
      bName,
      bAge,
      phoneNumber,
      bType,
      imgUrl,
      ownerImg,
      areaName,
      location,
    })
    await newBusiness.save();
     res.status(201).json({
      message: "Registration succsessful",
    });
  } catch (error) {
    console.log(error.message)
    res
      .status(400)
      .json({ message: "Something bad happend, please try again." });
  }
};
// ****************************###############################################*************************************########################
// #############################****GET LIST OF BUSINESS****###############################################################
const getBusinesses = async () => {
// Function to fetch businesses 
}
// #######################################*******************************VOLUNTEER'S METHOD*********************############################
// ****************************###############################################*************************************########################
// ########################################################################################################################################

// AUTHENTICATE NEW VOLUNTEERS
// export const authenticateVolunteer = async (req, _) => {
//   try {
//     const { email, password } = req.body;
//     if (!email | !password) {
//       return console.log("please fill the required fields!");
//     }
//     const userFound = Volunteers.findOne({ email: email });
//     if (userFound) {
//       const passwordMatch = bcrypt.compare(password, userFound.password);
//       if (passwordMatch) {
//         return console.log("Volunteer identified!");
//       } else {
//         return console.log("Invalid creds!");
//       }
//     } else {
//       return console.log("Invalid creds!");
//     }
//   } catch (error) {
//     return console.log(error);
//   }
// };

// ****************************###############################################*************************************########################
// ########################################################################################################################################

// REGISTER NEW VOLUNTEERS
// export const postNewVolunteer = async (req, _) => {
//   try {
//     const { fName, lName, email, password, passwordConfirm } = req.body;
//     if (!fName | !lName | !email | !password | !passwordConfirm) {
//       return console.log("Please fill the required fields!");
//     }

//     const emailFound = await Volunteers.findOne({ email: email });
//     const confirmationCode = jwt.sign({ email: email }, process.env.SECRET);
//     if (emailFound) {
//       return console.log("email already exists!!");
//     } else {
//       const volunteer = Volunteers({
//         fName,
//         lName,
//         email,
//         password,
//         passwordConfirm,
//         confirmationCode,
//       });
//       await volunteer.save();
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
