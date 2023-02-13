<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\Degree;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:student');
    }


    public function index()
    {

        $data = $this->getData();

        return view('student.index', $data);
    }


    public function logout()
    {
        Auth::guard('student')->logout();
        return redirect('/');
    }


    public function getData()
    {
        $time = Setting::where('name', 'show degrees date')->select('value')->get()->first()->value;

        $strtime = substr($time, 0, mb_strlen($time) - 3);

        $data = [];

        if (intval($strtime) - time() > 0) {
            $date = new DateTime('@' . $strtime);

            $now = new DateTime();

            $diff = $now->diff($date)->format('%a-%h-%i-%s');

            $diff = explode('-', $diff);

            array_push($diff, $time);

            $data = compact('diff');
        } else {
            $student = Auth::guard('student')->user();

            $degrees = Degree::whereBelongsTo($student)->with(['subject' => function ($q) {
                $q->select(['id', 'subject_name']);
            }])->get();

            if ($degrees->count() > 0) {
                $degrees->makeHidden(['id', 'student_id', 'subject_id']);

                $degrees->each(function ($item) {
                    $item->subject->makeHidden(['id']);
                });

                $total = $degrees->avg('degree');

                $data = compact('degrees', 'total');
            }
        }

        return $data;
    }
}
