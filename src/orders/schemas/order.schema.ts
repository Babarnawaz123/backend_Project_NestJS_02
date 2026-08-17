import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ])
  items!: Array<{
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({ default: 'PENDING' })
  status!: string; // PENDING, COMPLETED, CANCELLED
}

export const OrderSchema = SchemaFactory.createForClass(Order);
