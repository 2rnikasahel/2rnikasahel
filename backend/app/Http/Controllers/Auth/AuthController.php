<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VerificationCode;
use App\Services\SMS\SMSService;
use App\Services\Email\EmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(
        private SMSService $smsService,
        private EmailService $emailService
    ) {}

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'birth_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'birth_date' => $request->birth_date,
            'role' => 'customer',
            'is_verified' => false,
        ]);

        $verificationCode = VerificationCode::generate($user->phone, 'sms');
        $this->smsService->send($user->phone, "کد تایید: {$verificationCode->code}");

        return $this->success([
            'user' => ['uuid' => $user->uuid, 'name' => $user->name, 'phone' => $user->phone],
            'message' => 'ثبت‌نام با موفقیت انجام شد. لطفاً کد تایید ارسال شده به شماره موبایل را وارد کنید.',
            'requires_verification' => true,
        ], 'ثبت‌نام موفقیت‌آمیز بود', 201);
    }

    public function verifyPhone(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'code' => 'required|string|size:5',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $verificationCode = VerificationCode::where('identifier', $request->phone)
            ->where('type', 'sms')
            ->where('used', false)
            ->latest()
            ->first();

        if (!$verificationCode || !$verificationCode->isValid($request->code)) {
            return $this->error('کد تایید معتبر نیست یا منقضی شده است', 400);
        }

        $user = User::where('phone', $request->phone)->first();
        $user->update(['is_verified' => true, 'last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'ورود موفقیت‌آمیز بود');
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('شماره موبایل یا رمز عبور اشتباه است', 401);
        }

        if (!$user->is_verified) {
            $verificationCode = VerificationCode::generate($user->phone, 'sms');
            $this->smsService->send($user->phone, "کد تایید: {$verificationCode->code}");

            return $this->error('حساب شما تایید نشده است. کد تایید ارسال شد.', 403, [
                'requires_verification' => true,
            ]);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'ورود موفقیت‌آمیز بود');
    }

    public function redirectToGoogle(): JsonResponse
    {
        return $this->success([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function googleCallback(Request $request): JsonResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return $this->error('خطا در احراز هویت گوگل', 400);
        }

        $user = User::where('google_id', $googleUser->getId())->first();

        if (!$user) {
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                $user->update(['google_id' => $googleUser->getId()]);
            } else {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'customer',
                    'is_verified' => false,
                ]);
            }
        }

        if (!$user->is_verified && $user->email) {
            $verificationCode = VerificationCode::generate($user->email, 'email');
            $this->emailService->send(
                $user->email,
                'کد تایید ایمیل',
                'emails.verification',
                ['code' => $verificationCode->code, 'name' => $user->name]
            );

            return $this->success([
                'user' => ['uuid' => $user->uuid, 'email' => $user->email],
                'message' => 'لطفاً کد تایید ارسال شده به ایمیل را وارد کنید.',
                'requires_verification' => true,
            ]);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'ورود موفقیت‌آمیز بود');
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:5',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $verificationCode = VerificationCode::where('identifier', $request->email)
            ->where('type', 'email')
            ->where('used', false)
            ->latest()
            ->first();

        if (!$verificationCode || !$verificationCode->isValid($request->code)) {
            return $this->error('کد تایید معتبر نیست یا منقضی شده است', 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['is_verified' => true, 'last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'ورود موفقیت‌آمیز بود');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'خروج موفقیت‌آمیز بود');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(['user' => $request->user()]);
    }
}
