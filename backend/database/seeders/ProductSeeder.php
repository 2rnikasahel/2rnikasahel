<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'پمپ تصفیه استخر ۱.۵ اسب بخار استریم', 'brand' => 'استریم', 'unit' => 'عدد', 'price' => 7013500, 'original_price' => 10300000, 'discount' => 31, 'sku' => 'DR-STR-PMP-15'],
            ['name' => 'لوله پنج لایه نیوپایپ سایز ۱۶ میلی‌متر', 'brand' => 'نیوپایپ', 'unit' => 'متر', 'price' => 39150, 'original_price' => 52000, 'discount' => 25, 'sku' => 'DR-NWP-16'],
            ['name' => 'شیرآلات اهرمی روشویی مدل لوکس', 'brand' => 'قهرمان', 'unit' => 'عدد', 'price' => 1200000, 'original_price' => 1500000, 'discount' => 20, 'sku' => 'DR-SHR-001'],
            ['name' => 'پکیج دیواری گرمایشی بوتان', 'brand' => 'بوتان', 'unit' => 'عدد', 'price' => 15000000, 'original_price' => 18000000, 'discount' => 15, 'sku' => 'DR-BTN-001'],
            ['name' => 'رادیاتور آلومینیومی ایران رادیاتور', 'brand' => 'ایران رادیاتور', 'unit' => 'عدد', 'price' => 2500000, 'original_price' => 3000000, 'discount' => 16, 'sku' => 'DR-IR-001'],
            ['name' => 'پمپ آب خانگی پنتاکس', 'brand' => 'پنتاکس', 'unit' => 'عدد', 'price' => 4500000, 'original_price' => 5000000, 'discount' => 10, 'sku' => 'DR-PNT-001'],
            ['name' => 'لوله پلی‌اتیلن گازرسانی', 'brand' => 'پلیمر', 'unit' => 'متر', 'price' => 25000, 'original_price' => 30000, 'discount' => 16, 'sku' => 'DR-PLY-001'],
            ['name' => 'اتصالات برنجی فشار قوی', 'brand' => 'برنجی', 'unit' => 'عدد', 'price' => 150000, 'original_price' => 200000, 'discount' => 25, 'sku' => 'DR-BRN-001'],
            ['name' => 'شیر توکار فلوش‌والو', 'brand' => 'رکس', 'unit' => 'عدد', 'price' => 800000, 'original_price' => 1000000, 'discount' => 20, 'sku' => 'DR-FLS-001'],
            ['name' => 'سیفون ظرفشویی استیل', 'brand' => 'اکسیر', 'unit' => 'عدد', 'price' => 350000, 'original_price' => 400000, 'discount' => 12, 'sku' => 'DR-SFN-001'],
        ];

        // Generate remaining products up to 50
        for ($i = 11; $i <= 50; $i++) {
            $units = ['عدد', 'متر', 'شاخه', 'کیلوگرم', 'بسته', 'ست'];
            $unit = $units[array_rand($units)];
            $price = rand(50000, 5000000);
            $discount = rand(0, 1) ? rand(10, 30) : 0;
            $originalPrice = $discount > 0 ? ceil($price / (1 - $discount / 100)) : $price;

            $products[] = [
                'name' => "محصول تستی شماره {$i}",
                'brand' => 'برند تستی',
                'unit' => $unit,
                'price' => $price,
                'original_price' => $originalPrice,
                'discount' => $discount,
                'sku' => "TEST-PRD-{$i}",
            ];
        }

        foreach ($products as $productData) {
            Product::create(array_merge($productData, [
                'rating' => rand(30, 50) / 10,
                'reviews_count' => rand(0, 100),
                'in_stock' => true,
                'stock_count' => rand(1, 50),
                'status' => 'published',
                'images' => ['https://via.placeholder.com/300'],
                'features' => ['ویژگی ۱', 'ویژگی ۲'],
                'specs' => [['key' => 'وزن', 'value' => '1kg']],
                'tags' => ['تستی'],
            ]));
        }
    }
}
