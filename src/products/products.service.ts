import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, file: any) {
    const imageUrl = file?.filename
      ? `/uploads/${file.filename}`
      : file?.path || file?.originalname;

    if (!imageUrl) {
      throw new BadRequestException('Failed to process image upload.');
    }

    const newProduct = new this.productModel({
      ...createProductDto,
      image: imageUrl,
    });

    return newProduct.save();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto, file?: any) {
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    const updateData: any = { ...updateProductDto };

    // Update image path if a new image was uploaded
    if (file?.filename) {
      updateData.image = `/uploads/${file.filename}`;
    }

    return this.productModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return { message: 'Product deleted successfully' };
  }
}
