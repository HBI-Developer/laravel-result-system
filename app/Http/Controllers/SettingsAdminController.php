<?php

namespace App\Http\Controllers;

use App\Models\Setting;

class SettingsAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }


    public function putShowDate($request)
    {
        if (is_numeric(intval($request)) && $request > 0) {
            Setting::updateOrCreate(
                ['name'     => 'show degrees date'],
                ['value'    => $request]
            );
        }

        return 'success';
    }
}
