<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminLoginRequest;
use App\Http\Requests\StudentLoginRequest;
use App\Models\Setting;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        $this->middleware(['guest:admin', 'guest:student'])->except('logout');
    }

    public function main()
    {
        return view('index');
    }

    public function adminLoginForm()
    {
        return view('admin-login');
    }

    public function studentLoginForm()
    {
        return view('student-login');
    }

    public function isAdmin(AdminLoginRequest $request)
    {
        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {

            return redirect()->intended('/admin');
        }

        return redirect()->back()->with('error', 'اسم المستخدم أو كلمة المرور خطاً');
    }

    public function isStudent(StudentLoginRequest $request)
    {
        $student = Student::where('ssn', $request->ssn)->where('sitting_number', $request->sitting_number)->get();

        if ($student->count() > 0) {

            Auth::guard('student')->login($student->first());
            return redirect()->intended('/student');
        }

        return redirect()->back()->with('error', 'الرقم الوطني أو رقم الجلوس خطاً');
    }

    /********************************************** settings ***********************************************/

    public function getShowDate()
    {
        $date = Setting::where('name', 'show degrees date')->select('value')->get();

        if (!$date)
            return -1;

        return $date;
    }

    /*******************************************************************************************************/
}
