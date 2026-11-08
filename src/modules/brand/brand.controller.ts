import { Request, Response } from "express";

import { brandService } from "./brand.service";

import {
  createBrandSchema,
  updateBrandSchema,
} from "./brand.validation";


// CREATE BRAND
const createBrand = async (
  req: Request,
  res: Response
) => {

  try {

    const data =
      createBrandSchema.parse(
        req.body
      );


    const brand =
      await brandService.createBrand(
        data
      );


    return res.status(201).json({

      success: true,

      message:
        "Brand created successfully",

      data: brand,

    });


  } catch (error:any) {


    return res.status(400).json({

      success:false,

      message:
        error.message ||
        "Failed to create brand",

    });

  }

};



// GET ALL BRANDS
const getBrands = async (
  _req: Request,
  res: Response
) => {

  try {


    const brands =
      await brandService.getBrands();



    return res.status(200).json({

      success:true,

      message:
        "Brands retrieved successfully",

      data: brands,

    });



  } catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to retrieve brands",

    });

  }

};



// GET SINGLE BRAND
const getBrandById = async (
  req: Request,
  res: Response
) => {

  try {


    const brand =
      await brandService.getBrandById(
        req.params.id as string
      );



    if(!brand){

      return res.status(404).json({

        success:false,

        message:
          "Brand not found",

      });

    }



    return res.status(200).json({

      success:true,

      message:
        "Brand retrieved successfully",

      data:brand,

    });



  } catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to retrieve brand",

    });

  }

};



// UPDATE BRAND
const updateBrand = async (
  req: Request,
  res: Response
) => {

  try {


    const data =
      updateBrandSchema.parse(
        req.body
      );



    const brand =
      await brandService.updateBrand(

        req.params.id as string,

        data

      );



    return res.status(200).json({

      success:true,

      message:
        "Brand updated successfully",

      data:brand,

    });



  } catch(error:any){


    return res.status(400).json({

      success:false,

      message:
        error.message ||
        "Failed to update brand",

    });

  }

};



// DELETE BRAND
const deleteBrand = async (
  req: Request,
  res: Response
) => {

  try {


    await brandService.deleteBrand(
      req.params.id as string
    );



    return res.status(200).json({

      success:true,

      message:
        "Brand deleted successfully",

    });



  } catch(error:any){


    const message =
      error.message ||
      "Failed to delete brand";



    if(
      message === "Brand not found"
    ){

      return res.status(404).json({

        success:false,

        message,

      });

    }



    if(
      message ===
      "Cannot delete brand because it has products"
    ){

      return res.status(409).json({

        success:false,

        message,

      });

    }



    return res.status(500).json({

      success:false,

      message:
        "Internal server error",

    });

  }

};



export const brandController = {

  createBrand,

  getBrands,

  getBrandById,

  updateBrand,

  deleteBrand,

};