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

        // For access to this pages should not be logining

        $this -> middleware(['guest:admin', 'guest:student']) -> except('logout');
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
        // When Login in Admin Login Check if information is correct

        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {

            //If is correct Logining and redirect to Admin Dashboard

            return redirect()->intended('/admin');
        }

        // If incorrect redirect to Admin Login with invaild information error

        return redirect()->back()->with('error', 'اسم المستخدم أو كلمة المرور خطاً');
    }

    public function isStudent(StudentLoginRequest $request)
    {

        // When student Login Search if there's Student with SSN & Sitting Number in $request
        // variable and get that student info if it exist

        $student = Student::where('ssn', $request->ssn)->where('sitting_number', $request->sitting_number)->get();

        if ($student->count() > 0) {

            // If he exist Logiging student & redirect to student homepage

            Auth::guard('student')->login($student->first());
            return redirect()->intended('/student');
        }

        // If incorrect redirect to Student Login with invaild information error

        return redirect()->back()->with('error', 'الرقم الوطني أو رقم الجلوس خطاً');
    }

    /********************************************** settings ***********************************************/

    public function getShowDate()
    {

        // @variable $date contains date of open system for students

        $date = Setting::where('name', 'show degrees date')->select('value')->get();

        if (!$date)
            return -1;

        return $date;
    }

    /*******************************************************************************************************/
}
