import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

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
}
