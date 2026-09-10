import { Product } from '../models/Product.js';
import { catalogSeed } from '../data/catalogSeed.js';

export async function seedProducts() {
  const count = await Product.estimatedDocumentCount();
  if (count === 0) {
    await Product.insertMany(catalogSeed);
    console.info(`[seed] Inserted ${catalogSeed.length} catalog products`);
  }

  const unset = await Product.updateMany(
    { owner: { $exists: true } },
    { $unset: { owner: 1 } }
  );
  if (unset.modifiedCount) {
    console.info(`[seed] Removed owner from ${unset.modifiedCount} products`);
  }
}
