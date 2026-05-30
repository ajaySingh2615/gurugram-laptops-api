import type { Request, Response, NextFunction } from 'express';
import { cartService } from './cart.service.js';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const cart = await cartService.getCart(userId);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const item = await cartService.addItem(userId, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { quantity } = req.body;
      const item = await cartService.updateQuantity(userId, id, quantity);
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await cartService.removeItem(userId, id);
      res.status(200).json({ success: true, message: 'Item removed' });
    } catch (error) {
      next(error);
    }
  }

  async syncCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { items } = req.body;
      if (!Array.isArray(items)) {
        res.status(400).json({ success: false, message: 'Items array required' });
        return;
      }
      const cart = await cartService.syncCart(userId, items);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
