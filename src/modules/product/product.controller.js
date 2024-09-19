import { nanoid } from "nanoid";
import cloudnairy from "../../utils/cloud.js";
import slugify from "slugify";
import { productModel } from "../../../db/models/product.model.js";
import { cartModel } from "../../../db/models/cat.model.js";

// ! create product
const createProduct = async (req, res, next) => {
  //   ? check for image files
  if (!req.files) {
    return next(new Error("product images are required !"));
  }

  const productFolderName = nanoid();

  //   ? ubload product images
  const productImages = req.files.productImages;

  let uploadedProductImages = [];

  // ? upload product images to cloudnairy
  const upladImages = productImages.map((image) => {
    return cloudnairy.uploader.upload(image.path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/products/${productFolderName}`,
    });
  });

  // ? Wait for all uploads to finish
  const uploadResults = await Promise.all(upladImages);

  //   ? pushing the strings into a new array to store directly to products model
  uploadedProductImages = uploadResults.map((image) => ({
    id: image.public_id,
    url: image.secure_url,
  }));

  //   ? creating product
  req.body.slug = slugify(req.body.name);
  const product = await productModel.create({
    ...req.body,
    cloudFolder: productFolderName,
    images: uploadedProductImages,
  });

  if (!product) {
    return next(new Error("some thing wnt wrong product not created !"));
  }

  return res.json({
    success: true,
    message: "product created successfully",
    results: {
      product,
    },
  });
};

// ! update or edit product
const updateProduct = async (req, res, next) => {
  // ? searching for products
  const product = await productModel.findOne({ _id: req.body.id });

  if (!product) {
    return next(new Error("product not found !"));
  }

  //   ? check for image files
  if (req.files) {
    // ? delete old images
    await Promise.all(
      product.images.map((image) => cloudnairy.uploader.destroy(image.id))
    );

    // ? upload product images to cloudnairy
    const upladImages = req.files.productImages.map((image) => {
      return cloudnairy.uploader.upload(image.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`,
      });
    });

    // ? Wait for all uploads to finish
    const uploadResults = await Promise.all(upladImages);

    //   ? reassigning new image values to the product
    product.images = uploadResults.map((image) => ({
      id: image.public_id,
      url: image.secure_url,
    }));
  }

  const updatedProduct = await productModel.findByIdAndUpdate(
    {
      _id: req.body.id,
    },
    {
      ...req.body,
      slug: slugify(req.body.name),
    },
    {
      new: true,
    }
  );

  return res.json({
    success: true,
    message: "product updated successfully",
    results: {
      updatedProduct,
    },
  });
};

// ! delete product
const deleteProduct = async (req, res, next) => {
  // ? searching for product
  const product = await productModel.findOne({ _id: req.body.id });

  if (!product) {
    return next(new Error("product not found !"));
  }

  // ? delete product images
  await Promise.all(
    product.images.map((image) => cloudnairy.uploader.destroy(image.id))
  );

  //   ? delete folder
  await cloudnairy.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  );

  await productModel.findByIdAndDelete(req.body.id);

  return res.json({
    success: true,
    message: "product deleted successfully",
  });
};

export { createProduct, updateProduct, deleteProduct };
