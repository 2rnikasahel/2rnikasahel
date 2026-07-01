<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name, email, or phone
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(20);

        return $this->success($users);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->error('کاربر یافت نشد', 404);
        }
        return $this->success($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->error('کاربر یافت نشد', 404);
        }

        // Prevent self-demotion for super admin
        if ($user->id === $request->user()->id && $request->has('role') && $request->role !== 'super_admin') {
            return $this->error('شما نمی‌توانید نقش خود را تغییر دهید', 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'role' => 'sometimes|in:customer,admin,super_admin',
            'birth_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $user->update($request->only(['name', 'role', 'birth_date']));

        return $this->success($user, 'اطلاعات کاربر با موفقیت به‌روزرسانی شد');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->error('کاربر یافت نشد', 404);
        }

        // Prevent deleting self
        if ($user->id === request()->user()->id) {
            return $this->error('شما نمی‌توانید حساب خود را حذف کنید', 403);
        }

        $user->delete();
        return $this->success(null, 'کاربر با موفقیت حذف شد');
    }
}
