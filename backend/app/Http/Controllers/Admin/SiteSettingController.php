<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('value', 'key');
        return $this->success($settings);
    }

    public function update(Request $request, $key)
    {
        $setting = SiteSetting::setSetting($key, $request->value);
        return $this->success($setting, 'تنظیمات با موفقیت ذخیره شد');
    }
}
