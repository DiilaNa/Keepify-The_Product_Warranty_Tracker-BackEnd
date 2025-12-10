import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import cloudinary from "../../config/cloudinary";
import { Warranty } from "../../model/Warranty";
import { Category } from "../../model/Category";
import { Brand } from "../../model/Brand";

export const save_warranty= async(req:AuthRequest,res:Response) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const {name, purchase_date, expiry_date,description,serial_number,category,brand} = req.body
        let imageURl = "";

        if(req.file){
            const result: any = await new Promise((resolve,reject)=>{
                const uploadt_stream = cloudinary.uploader.upload_stream(
                    {folder:"warranties"},
                    (error,result)=>{
                        if(error){
                            return reject(error)
                        }
                        resolve(result)
                    }
                )
                uploadt_stream.end(req.file?.buffer)

            })
            imageURl = result.secure_url;
        }

        // Find Category ID
        const categoryDoc = await Category.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(400).json({ message: "Invalid category selected" });
            }

        // Find Brand ID
        const brandDoc = await Brand.findOne({ brand_name: brand });
            if (!brandDoc) {
                return res.status(400).json({ message: "Invalid brand selected" });
            }

        const newWarranty = new Warranty({
            name,
            purchase_date,
            expiry_date,
            description,
            serial_number,
            bill_image: imageURl,
            ownerId:req.user.sub,
            category: categoryDoc._id,
            brandId: brandDoc._id
        })

        await newWarranty.save();

        res.status(201).json({
            message:"Warranty Posted successfully",
            data: newWarranty
        })

    }catch(error:any){
        res.status(500).json({message:"Error saving Warranty",error: error?.message})
    }
}

export const get_brands_by_category = async (req:AuthRequest, res:Response) => {
  try {
    const { category } = req.params;

    const brands = await Brand.find(
      { category: category },
      { brand_name: 1, category: 1 }
    ).sort({ brand_name: 1 });

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (err:any) {
    res.status(500).json({
      message: "Error loading brands",
      error: err?.message,
    });
  }
};
  