<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(20);
        return $this->success($products);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'unit' => 'required|in:عدد,متر,شاخه,کیلوگرم,بسته,ست',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'sku' => 'required|string|unique:products',
            'category_id' => 'nullable|exists:categories,id',
            'images' => 'nullable|array',
            'features' => 'nullable|array',
            'specs' => 'nullable|array',
            'variations' => 'nullable|array',
            'tags' => 'nullable|array',
            'related_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $product = Product::create($request->all());

        return $this->success($product, 'محصول با موفقیت ایجاد شد', 201);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);
        if (!$product) {
            return $this->error('محصول یافت نشد', 404);
        }
        return $this->success($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return $this->error('محصول یافت نشد', 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'unit' => 'sometimes|required|in:عدد,متر,شاخه,کیلوگرم,بسته,ست',
            'price' => 'sometimes|required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'sku' => 'sometimes|required|string|unique:products,sku,' . $id,
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $product->update($request->all());

        return $this->success($product, 'محصول با موفقیت به‌روزرسانی شد');
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return $this->error('محصول یافت نشد', 404);
        }

        $product->delete();
        return $this->success(null, 'محصول با موفقیت حذف شد');
    }
}
