<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')->whereNull('parent_id')->get();
        return $this->success($categories);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'icon' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
            'icon' => $request->icon,
            'visible' => $request->visible ?? true,
        ]);

        return $this->success($category, 'دسته‌بندی با موفقیت ایجاد شد', 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return $this->error('دسته‌بندی یافت نشد', 404);
        }

        $category->update($request->only(['name', 'parent_id', 'icon', 'visible', 'order']));
        
        if ($request->has('name')) {
            $category->slug = Str::slug($request->name);
            $category->save();
        }

        return $this->success($category, 'دسته‌بندی با موفقیت به‌روزرسانی شد');
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return $this->error('دسته‌بندی یافت نشد', 404);
        }

        $category->delete();
        return $this->success(null, 'دسته‌بندی با موفقیت حذف شد');
    }
}
