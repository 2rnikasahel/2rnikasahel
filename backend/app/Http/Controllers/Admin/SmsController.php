<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmsProvider;
use App\Models\SmsLog;
use App\Services\SMS\SMSService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SmsController extends Controller
{
    public function __construct(private SMSService $smsService) {}

    public function providers()
    {
        $providers = SmsProvider::orderBy('priority')->get();
        return $this->success($providers);
    }

    public function updateProvider(Request $request, $id)
    {
        $provider = SmsProvider::find($id);
        if (!$provider) return $this->error('اپراتور یافت نشد', 404);

        $validator = Validator::make($request->all(), [
            'credentials' => 'nullable|array',
            'is_active' => 'boolean',
            'priority' => 'integer',
        ]);

        if ($validator->fails()) return $this->validationError($validator->errors());

        $provider->update($request->only(['credentials', 'is_active', 'priority']));
        return $this->success($provider, 'تنظیمات اپراتور به‌روزرسانی شد');
    }

    public function logs(Request $request)
    {
        $query = SmsLog::query()->latest();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('recipient')) {
            $query->where('recipient', 'like', "%{$request->recipient}%");
        }

        return $this->success($query->paginate(20));
    }

    public function sendTest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) return $this->validationError($validator->errors());

        $success = $this->smsService->send($request->phone, $request->message);
        
        SmsLog::create([
            'recipient' => $request->phone,
            'message' => $request->message,
            'status' => $success ? 'sent' : 'failed',
        ]);

        return $this->success(null, $success ? 'پیامک تست با موفقیت ارسال شد' : 'خطا در ارسال پیامک');
    }
}
