<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use App\Services\Email\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmailController extends Controller
{
    public function __construct(private EmailService $emailService) {}

    public function logs(Request $request)
    {
        $query = EmailLog::query()->latest();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('recipient')) {
            $query->where('recipient', 'like', "%{$request->recipient}%");
        }

        return $this->success($query->paginate(20));
    }

    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'to' => 'required|email',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        if ($validator->fails()) return $this->validationError($validator->errors());

        $success = $this->emailService->sendRaw($request->to, $request->subject, $request->body);
        
        EmailLog::create([
            'recipient' => $request->to,
            'subject' => $request->subject,
            'body' => $request->body,
            'status' => $success ? 'sent' : 'failed',
        ]);

        return $this->success(null, $success ? 'ایمیل با موفقیت ارسال شد' : 'خطا در ارسال ایمیل');
    }
}
